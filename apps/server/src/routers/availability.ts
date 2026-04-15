import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { managerProcedure, publicProcedure, router } from "../trpc";
import { db, blockedDates, events } from "@venuehub/db";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD expected");

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const availabilityRouter = router({
  // Public: blocked + booked dates for a tenant's public calendar
  getPublic: publicProcedure
    .input(z.object({ slug: z.string().min(1), fromDate: dateStr, toDate: dateStr }))
    .query(async ({ input }) => {
      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, input.slug),
      });
      if (!tenant) throw new TRPCError({ code: "NOT_FOUND" });

      const fromJs = new Date(input.fromDate + "T00:00:00Z");
      const toJs = new Date(input.toDate + "T23:59:59Z");

      const blocked = await db
        .select({ date: blockedDates.date })
        .from(blockedDates)
        .where(
          and(
            eq(blockedDates.tenantId, tenant.id),
            gte(blockedDates.date, input.fromDate),
            lte(blockedDates.date, input.toDate),
          ),
        );

      const booked = await db
        .select({ eventDate: events.eventDate, status: events.status })
        .from(events)
        .where(
          and(
            eq(events.tenantId, tenant.id),
            gte(events.eventDate, fromJs),
            lte(events.eventDate, toJs),
          ),
        );

      const bookedDates = Array.from(
        new Set(
          booked
            .filter((e) => e.status === "confirmed" || e.status === "completed")
            .map((e) => toDateOnly(new Date(e.eventDate))),
        ),
      );

      return {
        blockedDates: blocked.map((b) => b.date),
        bookedDates,
      };
    }),

  // Admin: list + add + delete blocked dates
  list: managerProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.tenantId, ctx.tenantId))
      .orderBy(asc(blockedDates.date));
  }),

  block: managerProcedure
    .input(z.object({ date: dateStr, reason: z.string().max(255).optional() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.blockedDates.findFirst({
        where: (b, { eq, and }) => and(eq(b.tenantId, ctx.tenantId), eq(b.date, input.date)),
      });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Date already blocked" });
      }
      await db.insert(blockedDates).values({
        tenantId: ctx.tenantId,
        date: input.date,
        reason: input.reason ?? null,
        createdByUserId: ctx.userId,
      });
      return { success: true };
    }),

  unblock: managerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(blockedDates)
        .where(and(eq(blockedDates.id, input.id), eq(blockedDates.tenantId, ctx.tenantId)));
      return { success: true };
    }),
});
