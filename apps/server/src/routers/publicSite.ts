import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { asc, eq, and } from "drizzle-orm";
import { publicProcedure, router } from "../trpc";
import { db, blocks, navigation } from "@venuehub/db";

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
});
