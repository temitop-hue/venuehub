import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { asc, eq, and } from "drizzle-orm";
import { publicProcedure, router } from "../trpc";
import { db, blocks, navigation, leads } from "@venuehub/db";

export const publicSiteRouter = router({
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        pageSlug: z.string().default("home"),
      }),
    )
    .query(async ({ input }) => {
      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, input.slug),
      });
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Site not found" });
      }

      const [theme, settings, navRows, page] = await Promise.all([
        db.query.tenantThemes.findFirst({
          where: (x, { eq }) => eq(x.tenantId, tenant.id),
        }),
        db.query.siteSettings.findFirst({
          where: (x, { eq }) => eq(x.tenantId, tenant.id),
        }),
        db
          .select()
          .from(navigation)
          .where(and(eq(navigation.tenantId, tenant.id), eq(navigation.isVisible, true)))
          .orderBy(asc(navigation.displayOrder)),
        db.query.pages.findFirst({
          where: (p, { eq, and }) =>
            and(eq(p.tenantId, tenant.id), eq(p.slug, input.pageSlug), eq(p.isPublished, true)),
        }),
      ]);

      if (!page) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      }

      const pageBlocks = await db
        .select()
        .from(blocks)
        .where(
          and(
            eq(blocks.pageId, page.id),
            eq(blocks.isPublished, true),
            eq(blocks.isVisible, true),
          ),
        )
        .orderBy(asc(blocks.displayOrder));

      return {
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
        theme: theme ?? null,
        settings: settings ?? null,
        navigation: navRows,
        page,
        blocks: pageBlocks,
      };
    }),

  submitContactForm: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        honeypot: z.string().optional(),
        name: z.string().min(1).max(255),
        email: z.string().email(),
        phone: z.string().max(50).optional(),
        eventType: z.string().max(100).optional(),
        eventDate: z.string().max(50).optional(),
        guestCount: z.number().int().min(0).max(100000).optional(),
        budget: z.number().int().min(0).max(100000000).optional(),
        message: z.string().max(5000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.honeypot && input.honeypot.trim().length > 0) {
        return { success: true };
      }

      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, input.slug),
      });
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Site not found" });
      }

      await db.insert(leads).values({
        tenantId: tenant.id,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        eventType: input.eventType?.trim() || null,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
        guestCount: input.guestCount ?? null,
        budget: input.budget ?? null,
        source: "website",
        notes: input.message?.trim() || null,
        status: "new",
      });

      return { success: true };
    }),
});
