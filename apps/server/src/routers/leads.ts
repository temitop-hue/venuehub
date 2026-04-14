import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db } from "@venuehub/db";
import * as schema from "@venuehub/db";
import { eq } from "drizzle-orm";

export const leadsRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().optional(),
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
      return db.insert(schema.leads).values({
        tenantId: ctx.tenantId,
        ...rest,
        eventDate: eventDate ? new Date(eventDate) : undefined,
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return db.query.leads.findMany({
      where: (l, { eq }) => eq(l.tenantId, ctx.tenantId),
      orderBy: (l, { desc }) => desc(l.createdAt),
    });
  }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum([
        "new",
        "contacted",
        "quoted",
        "negotiating",
        "booked",
        "lost",
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      return db.update(schema.leads)
        .set({ status: input.status })
        .where(eq(schema.leads.id, input.id));
    }),
});
