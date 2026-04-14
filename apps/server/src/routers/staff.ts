import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db, staff } from "@venuehub/db";
import { eq, and } from "drizzle-orm";

const staffInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
});

export const staffRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.query.staff.findMany({
      where: (staff, { eq }) => eq(staff.tenantId, ctx.tenantId),
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const staffMember = await db.query.staff.findFirst({
        where: (staff, { eq, and }) =>
          and(eq(staff.id, input.id), eq(staff.tenantId, ctx.tenantId)),
      });

      if (!staffMember) {
        throw new Error("Staff member not found");
      }

      return staffMember;
    }),

  create: protectedProcedure
    .input(staffInput)
    .mutation(async ({ ctx, input }) => {
      const [result] = await db
        .insert(staff)
        .values({
          tenantId: ctx.tenantId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          position: input.position,
          department: input.department,
        });

      return { id: result.insertId, ...input };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), ...staffInput.shape }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      await db
        .update(staff)
        .set({
          name: updateData.name,
          email: updateData.email,
          phone: updateData.phone,
          position: updateData.position,
          department: updateData.department,
        })
        .where(and(eq(staff.id, id), eq(staff.tenantId, ctx.tenantId)));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(staff)
        .where(and(eq(staff.id, input.id), eq(staff.tenantId, ctx.tenantId)));

      return { success: true };
    }),
});
