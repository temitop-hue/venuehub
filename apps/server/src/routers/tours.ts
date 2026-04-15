import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { randomBytes } from "crypto";
import { managerProcedure, publicProcedure, router } from "../trpc";
import { db, tourBookings, blockedDates, events, leads } from "@venuehub/db";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD expected");
const timeStr = z.string().regex(/^\d{2}:\d{2}$/, "HH:mm expected");

export const toursRouter = router({
  // ---- Public (used by the Book-a-Tour block) ----

  getBookedSlots: publicProcedure
    .input(z.object({ slug: z.string().min(1), fromDate: dateStr, toDate: dateStr }))
    .query(async ({ input }) => {
      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, input.slug),
      });
      if (!tenant) throw new TRPCError({ code: "NOT_FOUND" });

      const bookings = await db
        .select({ tourDate: tourBookings.tourDate, tourTime: tourBookings.tourTime })
        .from(tourBookings)
        .where(
          and(
            eq(tourBookings.tenantId, tenant.id),
            eq(tourBookings.status, "confirmed"),
            gte(tourBookings.tourDate, input.fromDate),
            lte(tourBookings.tourDate, input.toDate),
          ),
        );

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

      return {
        booked: bookings, // [{ tourDate, tourTime }]
        blockedDates: blocked.map((b) => b.date),
      };
    }),

  createBooking: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1).max(255),
        email: z.string().email(),
        phone: z.string().max(50).optional(),
        eventType: z.string().max(100).optional(),
        guestCount: z.number().int().min(0).optional(),
        tourDate: dateStr,
        tourTime: timeStr,
        message: z.string().max(2000).optional(),
        honeypot: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.honeypot && input.honeypot.trim().length > 0) {
        return { success: true };
      }

      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, input.slug),
      });
      if (!tenant) throw new TRPCError({ code: "NOT_FOUND" });

      const clash = await db.query.tourBookings.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.tenantId, tenant.id),
            eq(t.tourDate, input.tourDate),
            eq(t.tourTime, input.tourTime),
            eq(t.status, "confirmed"),
          ),
      });
      if (clash) {
        throw new TRPCError({ code: "CONFLICT", message: "That slot was just booked. Please pick another." });
      }

      const blocked = await db.query.blockedDates.findFirst({
        where: (b, { eq, and }) => and(eq(b.tenantId, tenant.id), eq(b.date, input.tourDate)),
      });
      if (blocked) {
        throw new TRPCError({ code: "CONFLICT", message: "That date isn't available." });
      }

      const cancelToken = randomBytes(24).toString("hex");

      await db.insert(tourBookings).values({
        tenantId: tenant.id,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        eventType: input.eventType?.trim() || null,
        guestCount: input.guestCount ?? null,
        tourDate: input.tourDate,
        tourTime: input.tourTime,
        message: input.message?.trim() || null,
        status: "confirmed",
        cancelToken,
      });

      // Mirror as a CRM lead so it shows in the Kanban
      await db.insert(leads).values({
        tenantId: tenant.id,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        eventType: input.eventType?.trim() || null,
        eventDate: null,
        guestCount: input.guestCount ?? null,
        source: "tour",
        notes: `Tour booked for ${input.tourDate} at ${input.tourTime}.${input.message ? " " + input.message.trim() : ""}`,
        status: "contacted",
      });

      return { success: true };
    }),

  // ---- Admin ----

  list: managerProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(tourBookings)
      .where(eq(tourBookings.tenantId, ctx.tenantId))
      .orderBy(desc(tourBookings.tourDate), desc(tourBookings.tourTime));
  }),

  updateStatus: managerProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["confirmed", "cancelled", "completed", "no_show"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(tourBookings)
        .set({ status: input.status })
        .where(and(eq(tourBookings.id, input.id), eq(tourBookings.tenantId, ctx.tenantId)));
      return { success: true };
    }),
});
