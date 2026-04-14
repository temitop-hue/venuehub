import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { managerProcedure, adminProcedure, router } from "../trpc";
import { db, pages, blocks, tenantThemes } from "@venuehub/db";
import { blockRegistry, isKnownBlockType } from "@venuehub/shared";

async function resolveHomePage(tenantId: number) {
  const page = await db.query.pages.findFirst({
    where: (p, { eq, and }) => and(eq(p.tenantId, tenantId), eq(p.slug, "home")),
  });
  if (!page) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Home page not found" });
  }
  return page;
}

async function assertBlockInTenant(tenantId: number, blockId: number) {
  const block = await db.query.blocks.findFirst({
    where: (b, { eq }) => eq(b.id, blockId),
  });
  if (!block) throw new TRPCError({ code: "NOT_FOUND" });
  const page = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.id, block.pageId),
  });
  if (!page || page.tenantId !== tenantId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return { block, page };
}

export const siteAdminRouter = router({
  getHomePage: managerProcedure.query(async ({ ctx }) => {
    const page = await resolveHomePage(ctx.tenantId);
    const blockRows = await db
      .select()
      .from(blocks)
      .where(eq(blocks.pageId, page.id))
      .orderBy(asc(blocks.displayOrder));
    return { page, blocks: blockRows };
  }),

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
    .input(z.object({ blockType: z.string(), displayOrder: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!isKnownBlockType(input.blockType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown block type" });
      }
      const page = await resolveHomePage(ctx.tenantId);
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
    .input(z.object({ orderedIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const page = await resolveHomePage(ctx.tenantId);
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
