import { z } from "zod";
import { protectedProcedure, managerProcedure, adminProcedure, router } from "../trpc";
import { db, leads } from "@venuehub/db";
import { eq, and } from "drizzle-orm";

const leadStatus = z.enum([
  "new",
  "contacted",
  "quoted",
  "negotiating",
  "booked",
  "lost",
]);

export const leadsRouter = router({
  create: managerProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      eventType: z.string().optional(),
      eventDate: z.string().optional(),
      guestCount: z.number().optional(),
      budget: z.number().optional(),
      source: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { eventDate, ...rest } = input;
      const [result] = await db.insert(leads).values({
        tenantId: ctx.tenantId,
        ...rest,
        eventDate: eventDate ? new Date(eventDate) : undefined,
      });
      return { id: result.insertId };
    }),

  list: protectedProcedure
    .input(z.object({ status: leadStatus.optional() }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [eq(leads.tenantId, ctx.tenantId)];
      if (input?.status) conditions.push(eq(leads.status, input.status));
      return db.select().from(leads).where(and(...conditions)).orderBy(leads.createdAt);
    }),

  updateStatus: managerProcedure
    .input(z.object({
      id: z.number(),
      status: leadStatus,
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(leads)
        .set({ status: input.status })
        .where(and(eq(leads.id, input.id), eq(leads.tenantId, ctx.tenantId)));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(leads)
        .where(and(eq(leads.id, input.id), eq(leads.tenantId, ctx.tenantId)));
      return { success: true };
    }),
});
