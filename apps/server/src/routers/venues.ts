import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db, venues } from "@venuehub/db";
import { eq, and } from "drizzle-orm";

const venueInput = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  capacity: z.number().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  rentPrice: z.string().optional(),
});

export const venueRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.query.venues.findMany({
      where: (venues, { eq }) => eq(venues.tenantId, ctx.tenantId),
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const venue = await db.query.venues.findFirst({
        where: (venues, { eq, and }) =>
          and(eq(venues.id, input.id), eq(venues.tenantId, ctx.tenantId)),
      });

      if (!venue) {
        throw new Error("Venue not found");
      }

      return venue;
    }),

  create: protectedProcedure
    .input(venueInput)
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(venues)
        .values({
          tenantId: ctx.tenantId!,
          name: input.name,
          description: input.description,
          capacity: input.capacity,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          phone: input.phone,
          email: input.email,
          rentPrice: input.rentPrice ? parseFloat(input.rentPrice).toString() : null,
        });

      return { id: (result as any).insertId, ...input };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), ...venueInput.shape }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      await db
        .update(venues)
        .set({
          name: updateData.name,
          description: updateData.description,
          capacity: updateData.capacity,
          address: updateData.address,
          city: updateData.city,
          state: updateData.state,
          zipCode: updateData.zipCode,
          phone: updateData.phone,
          email: updateData.email,
          rentPrice: updateData.rentPrice ? parseFloat(updateData.rentPrice).toString() : null,
        })
        .where(and(eq(venues.id, id), eq(venues.tenantId, ctx.tenantId!)));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(venues)
        .where(and(eq(venues.id, input.id), eq(venues.tenantId, ctx.tenantId)));

      return { success: true };
    }),
});
