import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { db, tenants } from "@venuehub/db";
import { eq } from "drizzle-orm";

export const tenantRouter = router({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const result = await db
        .insert(tenants)
        .values({
          name: input.name,
          slug: input.name.toLowerCase().replace(/\s+/g, "-"),
        });

      return { id: (result as any).insertId, name: input.name };
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const tenant = await db.query.tenants.findFirst({
      where: (tenants, { eq }) => eq(tenants.id, ctx.tenantId),
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    return tenant;
  }),

  update: protectedProcedure
    .input(z.object({ name: z.string().optional(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(tenants)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(tenants.id, ctx.tenantId));

      return { success: true };
    }),
});
