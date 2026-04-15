import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq, and, ne } from "drizzle-orm";
import { managerProcedure, adminProcedure, router } from "../trpc";
import { db, pages, blocks, tenantThemes } from "@venuehub/db";
import { blockRegistry, isKnownBlockType } from "@venuehub/shared";

const slugPattern = /^[a-z0-9-]{1,100}$/;

async function resolvePageForTenant(tenantId: number, pageId: number) {
  const page = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.id, pageId),
  });
  if (!page || page.tenantId !== tenantId) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
  }
  return page;
}

async function assertBlockInTenant(tenantId: number, blockId: number) {
  const block = await db.query.blocks.findFirst({
    where: (b, { eq }) => eq(b.id, blockId),
  });
  if (!block) throw new TRPCError({ code: "NOT_FOUND" });
  const page = await resolvePageForTenant(tenantId, block.pageId);
  return { block, page };
}

export const siteAdminRouter = router({
  // -------- PAGES --------

  listPages: managerProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(pages)
      .where(eq(pages.tenantId, ctx.tenantId))
      .orderBy(asc(pages.displayOrder), asc(pages.id));
  }),

  getPage: managerProcedure
    .input(z.object({ pageId: z.number() }))
    .query(async ({ ctx, input }) => {
      const page = await resolvePageForTenant(ctx.tenantId, input.pageId);
      const blockRows = await db
        .select()
        .from(blocks)
        .where(eq(blocks.pageId, page.id))
        .orderBy(asc(blocks.displayOrder));
      return { page, blocks: blockRows };
    }),

  // Back-compat for any caller using the old name (and used by the
  // builder when the user lands without a pageId).
  getHomePage: managerProcedure.query(async ({ ctx }) => {
    const page = await db.query.pages.findFirst({
      where: (p, { eq, and }) => and(eq(p.tenantId, ctx.tenantId), eq(p.slug, "home")),
    });
    if (!page) throw new TRPCError({ code: "NOT_FOUND", message: "Home page not found" });
    const blockRows = await db
      .select()
      .from(blocks)
      .where(eq(blocks.pageId, page.id))
      .orderBy(asc(blocks.displayOrder));
    return { page, blocks: blockRows };
  }),

  createPage: managerProcedure
    .input(
      z.object({
        slug: z.string().regex(slugPattern, "Use lowercase letters, numbers, and hyphens"),
        title: z.string().min(1).max(255),
        copyFromPageId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug.trim().toLowerCase();
      const clash = await db.query.pages.findFirst({
        where: (p, { eq, and }) => and(eq(p.tenantId, ctx.tenantId), eq(p.slug, slug)),
      });
      if (clash) {
        throw new TRPCError({ code: "CONFLICT", message: "A page with that URL already exists" });
      }

      const lastPage = await db
        .select({ displayOrder: pages.displayOrder })
        .from(pages)
        .where(eq(pages.tenantId, ctx.tenantId))
        .orderBy(desc(pages.displayOrder))
        .limit(1);
      const nextOrder = (lastPage[0]?.displayOrder ?? -1) + 1;

      const [pageInsert] = await db.insert(pages).values({
        tenantId: ctx.tenantId,
        slug,
        title: input.title.trim(),
        isPublished: true,
        displayOrder: nextOrder,
      });
      const newPageId = pageInsert.insertId;

      if (input.copyFromPageId) {
        const sourcePage = await resolvePageForTenant(ctx.tenantId, input.copyFromPageId);
        const sourceBlocks = await db
          .select()
          .from(blocks)
          .where(eq(blocks.pageId, sourcePage.id))
          .orderBy(asc(blocks.displayOrder));
        for (const b of sourceBlocks) {
          await db.insert(blocks).values({
            pageId: newPageId,
            blockType: b.blockType,
            blockData: b.blockData as Record<string, unknown>,
            displayOrder: b.displayOrder,
            isVisible: b.isVisible,
            isPublished: b.isPublished,
            isCurrentDraft: b.isCurrentDraft,
          });
        }
      }

      return { id: newPageId, slug };
    }),

  updatePage: managerProcedure
    .input(
      z.object({
        pageId: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().regex(slugPattern).optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional(),
        isPublished: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const page = await resolvePageForTenant(ctx.tenantId, input.pageId);
      if (input.slug && input.slug !== page.slug) {
        if (page.slug === "home") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "The home page slug cannot be changed" });
        }
        const slug = input.slug.trim().toLowerCase();
        const clash = await db.query.pages.findFirst({
          where: (p, { eq, and }) =>
            and(eq(p.tenantId, ctx.tenantId), eq(p.slug, slug), ne(p.id, input.pageId)),
        });
        if (clash) throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
      }
      await db
        .update(pages)
        .set({
          ...(input.title !== undefined ? { title: input.title.trim() } : {}),
          ...(input.slug !== undefined && page.slug !== "home"
            ? { slug: input.slug.trim().toLowerCase() }
            : {}),
          ...(input.metaTitle !== undefined ? { metaTitle: input.metaTitle } : {}),
          ...(input.metaDescription !== undefined
            ? { metaDescription: input.metaDescription }
            : {}),
          ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
        })
        .where(eq(pages.id, input.pageId));
      return { success: true };
    }),

  reorderPages: managerProcedure
    .input(z.object({ orderedIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const allowed = await db
        .select({ id: pages.id })
        .from(pages)
        .where(eq(pages.tenantId, ctx.tenantId));
      const allowedIds = new Set(allowed.map((a) => a.id));
      for (let i = 0; i < input.orderedIds.length; i++) {
        const id = input.orderedIds[i];
        if (!allowedIds.has(id)) continue;
        await db.update(pages).set({ displayOrder: i }).where(eq(pages.id, id));
      }
      return { success: true };
    }),

  deletePage: adminProcedure
    .input(z.object({ pageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const page = await resolvePageForTenant(ctx.tenantId, input.pageId);
      if (page.slug === "home") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "The home page cannot be deleted" });
      }
      await db.delete(blocks).where(eq(blocks.pageId, page.id));
      await db.delete(pages).where(eq(pages.id, page.id));
      return { success: true };
    }),

  // -------- BLOCKS --------

  updateBlock: managerProcedure
    .input(z.object({ id: z.number(), data: z.unknown() }))
    .mutation(async ({ ctx, input }) => {
      const { block } = await assertBlockInTenant(ctx.tenantId, input.id);
      if (!isKnownBlockType(block.blockType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown block type" });
      }
      let parsed;
      try {
        parsed = blockRegistry[block.blockType].schema.parse(input.data);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err instanceof Error ? err.message : "Invalid block data",
        });
      }
      await db
        .update(blocks)
        .set({ blockData: parsed as Record<string, unknown> })
        .where(eq(blocks.id, input.id));
      return { success: true };
    }),

  addBlock: managerProcedure
    .input(
      z.object({
        pageId: z.number(),
        blockType: z.string(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isKnownBlockType(input.blockType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown block type" });
      }
      const page = await resolvePageForTenant(ctx.tenantId, input.pageId);
      const entry = blockRegistry[input.blockType];
      let data;
      try {
        data = entry.schema.parse(entry.defaults);
      } catch {
        data = entry.defaults;
      }
      const lastBlock = await db
        .select({ displayOrder: blocks.displayOrder })
        .from(blocks)
        .where(eq(blocks.pageId, page.id))
        .orderBy(desc(blocks.displayOrder))
        .limit(1);
      const order = input.displayOrder ?? (lastBlock[0]?.displayOrder ?? -1) + 1;
      const [result] = await db.insert(blocks).values({
        pageId: page.id,
        blockType: input.blockType,
        blockData: data as Record<string, unknown>,
        displayOrder: order,
        isVisible: true,
        isPublished: true,
        isCurrentDraft: false,
      });
      return { id: result.insertId };
    }),

  deleteBlock: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await assertBlockInTenant(ctx.tenantId, input.id);
      await db.delete(blocks).where(eq(blocks.id, input.id));
      return { success: true };
    }),

  reorderBlocks: managerProcedure
    .input(z.object({ pageId: z.number(), orderedIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const page = await resolvePageForTenant(ctx.tenantId, input.pageId);
      const allowed = await db
        .select({ id: blocks.id })
        .from(blocks)
        .where(eq(blocks.pageId, page.id));
      const allowedIds = new Set(allowed.map((a) => a.id));
      for (let i = 0; i < input.orderedIds.length; i++) {
        const id = input.orderedIds[i];
        if (!allowedIds.has(id)) continue;
        await db.update(blocks).set({ displayOrder: i }).where(eq(blocks.id, id));
      }
      return { success: true };
    }),

  toggleVisibility: managerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { block } = await assertBlockInTenant(ctx.tenantId, input.id);
      await db
        .update(blocks)
        .set({ isVisible: !block.isVisible })
        .where(eq(blocks.id, input.id));
      return { success: true, isVisible: !block.isVisible };
    }),

  // -------- THEME --------

  updateTheme: managerProcedure
    .input(
      z.object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        accentColor: z.string().optional(),
        headingFont: z.string().optional(),
        bodyFont: z.string().optional(),
        borderRadius: z.number().int().min(0).max(24).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(tenantThemes)
        .set(input)
        .where(eq(tenantThemes.tenantId, ctx.tenantId));
      return { success: true };
    }),
});
