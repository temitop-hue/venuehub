import "dotenv/config";
import { db } from "./client";
import { tenants, tenantThemes, pages, blocks, siteSettings } from "./schema";
import { eq } from "drizzle-orm";

async function seedDemo() {
  console.log("Seeding demo luxury venue at slug 'demo'…");

  let tenantId: number;
  const existing = await db.query.tenants.findFirst({
    where: (t, { eq }) => eq(t.slug, "demo"),
  });

  if (existing) {
    console.log(`Demo tenant already exists (id=${existing.id}). Refreshing content.`);
    tenantId = existing.id;
    await db.delete(blocks).where(
      eq(blocks.pageId,
        (await db.query.pages.findFirst({
          where: (p, { eq, and }) => and(eq(p.tenantId, tenantId), eq(p.slug, "home")),
        }))?.id ?? 0),
    );
    await db.delete(pages).where(eq(pages.tenantId, tenantId));
    await db.delete(tenantThemes).where(eq(tenantThemes.tenantId, tenantId));
    await db.delete(siteSettings).where(eq(siteSettings.tenantId, tenantId));
  } else {
    const [t] = await db.insert(tenants).values({
      name: "Maison Lumière",
      slug: "demo",
      description: "A luxury event venue demonstration.",
    });
    tenantId = t.insertId;
    console.log(`Created demo tenant (id=${tenantId}).`);
  }

  await db.insert(tenantThemes).values({
    tenantId,
    tone: "luxury",
    primaryColor: "#0d0d0d",
    secondaryColor: "#f7f3ea",
    accentColor: "#c9a86a",
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    heroOverlayOpacity: "0.45",
    borderRadius: 2,
  });

  await db.insert(siteSettings).values({
    tenantId,
    businessName: "Maison Lumière",
    contactEmail: "hello@maisonlumiere.example",
    bookingEmail: "book@maisonlumiere.example",
    phone: "(555) 123-4567",
    city: "Burtonsville",
    state: "MD",
    country: "US",
    timezone: "America/New_York",
    currency: "USD",
  });

  const [pageResult] = await db.insert(pages).values({
    tenantId,
    slug: "home",
    title: "Home",
    metaTitle: "Maison Lumière — Luxury Events",
    metaDescription: "Where extraordinary moments become timeless memories.",
    isPublished: true,
    displayOrder: 0,
  });
  const homePageId = pageResult.insertId;

  await db.insert(blocks).values({
    pageId: homePageId,
    blockType: "HeroBlock",
    blockData: {
      headline: "Maison Lumière",
      subheadline:
        "A luxury venue in the heart of Burtonsville — where extraordinary moments become timeless memories.",
      backgroundType: "image",
      backgroundUrl:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80",
      overlayOpacity: 0.5,
      ctaLabel: "Book a Private Tour",
      ctaHref: "#contact",
      alignment: "center",
      height: "screen",
    },
    displayOrder: 0,
    isVisible: true,
    isPublished: true,
    isCurrentDraft: false,
  });

  console.log("✓ Demo tenant seeded.");
  console.log("  Visit: /v/demo");
}

seedDemo()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
