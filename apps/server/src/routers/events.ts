import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db, events } from "@venuehub/db";
import { eq, and, gte, lte } from "drizzle-orm";

const eventInput = z.object({
  venueId: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  eventDate: z.string().or(z.date()),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  guestCount: z.number().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  totalAmount: z.string().optional(),
  advanceAmount: z.string().optional(),
});

const listFilters = z.object({
  venueId: z.number().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
}).optional();

export const eventRouter = router({
  list: protectedProcedure
    .input(listFilters)
    .query(async ({ ctx, input }) => {
      const conditions = [eq(events.tenantId, ctx.tenantId)];
      if (input?.venueId) conditions.push(eq(events.venueId, input.venueId));
      if (input?.status) conditions.push(eq(events.status, input.status));
      if (input?.dateFrom) conditions.push(gte(events.eventDate, new Date(input.dateFrom)));
      if (input?.dateTo) conditions.push(lte(events.eventDate, new Date(input.dateTo)));

      return db.select().from(events).where(and(...conditions));
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const event = await db.query.events.findFirst({
        where: (events, { eq, and }) =>
          and(eq(events.id, input.id), eq(events.tenantId, ctx.tenantId)),
      });

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    }),

  create: protectedProcedure
    .input(eventInput)
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(events)
        .values({
          tenantId: ctx.tenantId!,
          venueId: input.venueId,
          title: input.title,
          description: input.description,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          eventDate: new Date(input.eventDate),
          startTime: input.startTime,
          endTime: input.endTime,
          guestCount: input.guestCount,
          status: input.status,
          totalAmount: input.totalAmount ? parseFloat(input.totalAmount).toString() : null,
          advanceAmount: input.advanceAmount ? parseFloat(input.advanceAmount).toString() : null,
        });

      return { id: (result as any).insertId, ...input };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), ...eventInput.shape }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      await db
        .update(events)
        .set({
          venueId: updateData.venueId,
          title: updateData.title,
          description: updateData.description,
          clientName: updateData.clientName,
          clientEmail: updateData.clientEmail,
          clientPhone: updateData.clientPhone,
          eventDate: new Date(updateData.eventDate),
          startTime: updateData.startTime,
          endTime: updateData.endTime,
          guestCount: updateData.guestCount,
          status: updateData.status,
          totalAmount: updateData.totalAmount ? parseFloat(updateData.totalAmount).toString() : null,
          advanceAmount: updateData.advanceAmount ? parseFloat(updateData.advanceAmount).toString() : null,
        })
        .where(and(eq(events.id, id), eq(events.tenantId, ctx.tenantId!)));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(events)
        .where(and(eq(events.id, input.id), eq(events.tenantId, ctx.tenantId)));

      return { success: true };
    }),
});
