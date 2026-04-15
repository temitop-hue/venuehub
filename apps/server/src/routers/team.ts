import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { adminProcedure, managerProcedure, publicProcedure, router } from "../trpc";
import { db, invites, users, tenants } from "@venuehub/db";
import { hashPassword, createJWT } from "../auth";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const teamRouter = router({
  listMembers: managerProcedure.query(async ({ ctx }) => {
    return db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.tenantId, ctx.tenantId))
      .orderBy(desc(users.createdAt));
  }),

  listInvites: managerProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(invites)
      .where(eq(invites.tenantId, ctx.tenantId))
      .orderBy(desc(invites.createdAt));
  }),

  invite: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "manager", "user"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();

      // Already a member?
      const existingUser = await db.query.users.findFirst({
        where: (u, { eq, and }) => and(eq(u.tenantId, ctx.tenantId), eq(u.email, email)),
      });
      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT", message: "That email already belongs to a team member." });
      }

      // Already invited and still pending?
      const existingInvite = await db.query.invites.findFirst({
        where: (i, { eq, and, isNull }) =>
          and(eq(i.tenantId, ctx.tenantId), eq(i.email, email), isNull(i.acceptedAt)),
      });
      if (existingInvite && new Date(existingInvite.expiresAt) > new Date()) {
        return { id: existingInvite.id, token: existingInvite.token, reused: true };
      }

      const token = randomBytes(24).toString("hex");
      const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

      const [result] = await db.insert(invites).values({
        tenantId: ctx.tenantId,
        email,
        role: input.role,
        token,
        invitedByUserId: ctx.userId,
        expiresAt,
      });

      return { id: result.insertId, token, reused: false };
    }),

  cancelInvite: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(invites)
        .where(and(eq(invites.id, input.id), eq(invites.tenantId, ctx.tenantId)));
      return { success: true };
    }),

  updateMemberRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["admin", "manager", "user"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.userId && input.role !== "admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You can't demote yourself." });
      }
      await db
        .update(users)
        .set({ role: input.role })
        .where(and(eq(users.id, input.userId), eq(users.tenantId, ctx.tenantId)));
      return { success: true };
    }),

  removeMember: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.userId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You can't remove yourself." });
      }
      await db
        .update(users)
        .set({ isActive: false })
        .where(and(eq(users.id, input.userId), eq(users.tenantId, ctx.tenantId)));
      return { success: true };
    }),

  // ---- Public: accept an invite ----

  getInvite: publicProcedure
    .input(z.object({ token: z.string().min(10) }))
    .query(async ({ input }) => {
      const invite = await db.query.invites.findFirst({
        where: (i, { eq }) => eq(i.token, input.token),
      });
      if (!invite) throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
      if (invite.acceptedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invite has already been used" });
      }
      if (new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invite has expired" });
      }
      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.id, invite.tenantId),
      });
      return {
        email: invite.email,
        role: invite.role,
        tenantName: tenant?.name ?? "",
      };
    }),

  acceptInvite: publicProcedure
    .input(
      z.object({
        token: z.string().min(10),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const invite = await db.query.invites.findFirst({
        where: (i, { eq }) => eq(i.token, input.token),
      });
      if (!invite) throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
      if (invite.acceptedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invite has already been used" });
      }
      if (new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invite has expired" });
      }

      const hashed = await hashPassword(input.password);
      const [userInsert] = await db.insert(users).values({
        tenantId: invite.tenantId,
        email: invite.email,
        password: hashed,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        role: invite.role,
        isActive: true,
      });
      const userId = userInsert.insertId;

      await db
        .update(invites)
        .set({ acceptedAt: new Date() })
        .where(eq(invites.id, invite.id));

      const token = createJWT(userId, invite.tenantId, invite.email, invite.role);
      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.id, invite.tenantId),
      });

      return {
        token,
        user: {
          id: userId,
          email: invite.email,
          firstName: input.firstName,
          lastName: input.lastName,
          tenantId: invite.tenantId,
          role: invite.role,
          tenant: tenant
            ? {
                id: tenant.id,
                name: tenant.name,
                slug: tenant.slug,
                onboardingComplete: tenant.onboardingComplete,
              }
            : null,
        },
      };
    }),
});
