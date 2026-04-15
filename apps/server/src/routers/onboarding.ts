import { z } from "zod";
import { and, eq, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import {
  db,
  tenants,
  tenantThemes,
  pages,
  blocks,
  siteSettings,
} from "@venuehub/db";
import {
  TONE_PRESETS,
  buildSitePages,
  type Tone,
} from "@venuehub/shared";

const slugPattern = /^[a-z0-9-]{3,60}$/;

export const onboardingRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    const tenant = await db.query.tenants.findFirst({
      where: (t, { eq }) => eq(t.id, ctx.tenantId),
    });
    if (!tenant) throw new TRPCError({ code: "NOT_FOUND" });

    const theme = await db.query.tenantThemes.findFirst({
      where: (t, { eq }) => eq(t.tenantId, ctx.tenantId),
    });
    const homePage = await db.query.pages.findFirst({
      where: (p, { eq, and }) =>
        and(eq(p.tenantId, ctx.tenantId), eq(p.slug, "home")),
    });

    return {
      complete: tenant.onboardingComplete,
      slug: tenant.slug,
      name: tenant.name,
      hasTheme: Boolean(theme),
      hasHomePage: Boolean(homePage),
    };
  }),

  checkSlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.slug.trim().toLowerCase();
      if (!slugPattern.test(slug)) {
        return { available: false, reason: "invalid" as const };
      }
      const reserved = ["app", "api", "admin", "www", "dashboard", "login", "onboarding", "v"];
      if (reserved.includes(slug)) {
        return { available: false, reason: "reserved" as const };
      }
      const clash = await db.query.tenants.findFirst({
        where: (t, { eq, and }) => and(eq(t.slug, slug), ne(t.id, ctx.tenantId)),
      });
      return { available: !clash, reason: clash ? ("taken" as const) : null };
    }),

  updateBasics: protectedProcedure
    .input(
      z.object({
        slug: z.string().regex(slugPattern),
        primaryEventType: z.string().min(1),
        capacity: z.number().int().min(1).max(100000),
        city: z.string().min(1),
        state: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug.trim().toLowerCase();
      const clash = await db.query.tenants.findFirst({
        where: (t, { eq, and }) => and(eq(t.slug, slug), ne(t.id, ctx.tenantId)),
      });
      if (clash) {
        throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
      }

      await db
        .update(tenants)
        .set({ slug })
        .where(eq(tenants.id, ctx.tenantId));

      const existingSettings = await db.query.siteSettings.findFirst({
        where: (s, { eq }) => eq(s.tenantId, ctx.tenantId),
      });
      if (existingSettings) {
        await db
          .update(siteSettings)
          .set({ city: input.city, state: input.state })
          .where(eq(siteSettings.tenantId, ctx.tenantId));
      } else {
        await db.insert(siteSettings).values({
          tenantId: ctx.tenantId,
          city: input.city,
          state: input.state,
          country: "US",
        });
      }

      return { success: true, slug };
    }),

  applyTemplate: protectedProcedure
    .input(
      z.object({
        tone: z.enum(["luxury", "modern", "minimal", "classic", "corporate"]),
        primaryEventType: z.string().default("Weddings"),
        capacity: z.number().int().default(200),
        city: z.string().default(""),
        state: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.id, ctx.tenantId),
      });
      if (!tenant) throw new TRPCError({ code: "NOT_FOUND" });

      const preset = TONE_PRESETS[input.tone as Tone];

      const existingTheme = await db.query.tenantThemes.findFirst({
        where: (t, { eq }) => eq(t.tenantId, ctx.tenantId),
      });
      if (existingTheme) {
        await db
          .update(tenantThemes)
          .set({
            tone: preset.tone,
            primaryColor: preset.primaryColor,
            secondaryColor: preset.secondaryColor,
            accentColor: preset.accentColor,
            headingFont: preset.headingFont,
            bodyFont: preset.bodyFont,
            heroOverlayOpacity: preset.heroOverlayOpacity.toString(),
            borderRadius: preset.borderRadius,
          })
          .where(eq(tenantThemes.tenantId, ctx.tenantId));
      } else {
        await db.insert(tenantThemes).values({
          tenantId: ctx.tenantId,
          tone: preset.tone,
          primaryColor: preset.primaryColor,
          secondaryColor: preset.secondaryColor,
          accentColor: preset.accentColor,
          headingFont: preset.headingFont,
          bodyFont: preset.bodyFont,
          heroOverlayOpacity: preset.heroOverlayOpacity.toString(),
          borderRadius: preset.borderRadius,
        });
      }

      const sitePages = buildSitePages(
        {
          venueName: tenant.name,
          city: input.city,
          state: input.state,
          primaryEventType: input.primaryEventType,
          capacity: input.capacity,
        },
        input.tone as Tone,
      );

      const allExisting = await db
        .select({ id: pages.id })
        .from(pages)
        .where(eq(pages.tenantId, ctx.tenantId));
      for (const p of allExisting) {
        await db.delete(blocks).where(eq(blocks.pageId, p.id));
      }
      await db.delete(pages).where(eq(pages.tenantId, ctx.tenantId));

      const interpolate = (data: Record<string, unknown>): Record<string, unknown> => {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(data)) {
          if (typeof v === "string") out[k] = v.replace(/__SLUG__/g, tenant.slug);
          else out[k] = v;
        }
        return out;
      };

      let firstPageSlug = "home";
      for (const tplPage of sitePages) {
        const [pageResult] = await db.insert(pages).values({
          tenantId: ctx.tenantId,
          slug: tplPage.slug,
          title: tplPage.title,
          metaTitle: tplPage.metaTitle,
          metaDescription: tplPage.metaDescription,
          isPublished: true,
          displayOrder: tplPage.displayOrder,
        });
        const pageId = pageResult.insertId;
        if (tplPage.slug === "home") firstPageSlug = tplPage.slug;

        for (const b of tplPage.blocks) {
          await db.insert(blocks).values({
          pageId,
            blockType: b.blockType,
            blockData: interpolate(b.blockData as Record<string, unknown>),
            displayOrder: b.displayOrder,
            isVisible: true,
            isPublished: true,
            isCurrentDraft: false,
          });
        }
      }

      return { success: true, pageSlug: firstPageSlug, tenantSlug: tenant.slug };
    }),

  complete: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(tenants)
      .set({ onboardingComplete: true })
      .where(eq(tenants.id, ctx.tenantId));
    return { success: true };
  }),
});
