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
    const homePage = await db.query.pages.findFirst({
      where: (p, { eq, and }) => and(eq(p.tenantId, tenantId), eq(p.slug, "home")),
    });
    if (homePage) {
      await db.delete(blocks).where(eq(blocks.pageId, homePage.id));
    }
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
    metaTitle: "Maison Lumière — Luxury Events in Burtonsville",
    metaDescription:
      "A luxury venue in the heart of Burtonsville — weddings, corporate events, and private gatherings.",
    isPublished: true,
    displayOrder: 0,
  });
  const homePageId = pageResult.insertId;

  const blockRows = [
    {
      blockType: "HeroBlock",
      blockData: {
        headline: "Where moments become memories",
        subheadline:
          "A luxury venue in the heart of Burtonsville. Host weddings, corporate galas, and private celebrations in a space crafted for the extraordinary.",
        backgroundType: "image",
        backgroundUrl:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80",
        overlayOpacity: 0.5,
        ctaLabel: "Book a Private Tour",
        ctaHref: "#cta",
        alignment: "center",
        height: "screen",
      },
      displayOrder: 0,
    },
    {
      blockType: "TextSection",
      blockData: {
        eyebrow: "Our Story",
        heading: "Timeless elegance, thoughtfully hosted",
        body:
          "Set within a restored estate, Maison Lumière is a venue for moments that matter. Our team pairs a century-old architecture with modern hospitality to deliver events that feel as effortless as they are unforgettable.\n\nFrom the first site visit to the final toast, we handle every detail — so you can be fully present.",
        alignment: "center",
        maxWidth: "medium",
        background: "secondary",
        paddingY: "xl",
      },
      displayOrder: 1,
    },
    {
      blockType: "FeatureList",
      blockData: {
        eyebrow: "What's Included",
        heading: "An experience, not just a venue",
        layout: "grid",
        columns: 3,
        features: [
          {
            icon: "✦",
            title: "Full-Service Coordination",
            description:
              "Dedicated event lead, day-of timeline management, and vendor liaison — start to finish.",
          },
          {
            icon: "✦",
            title: "Curated Vendor Partners",
            description:
              "Hand-picked caterers, florists, and entertainers who know our space and standards.",
          },
          {
            icon: "✦",
            title: "Flexible Floor Plans",
            description:
              "Ceremony, reception, cocktail hour, and private lounges all within one seamless footprint.",
          },
          {
            icon: "✦",
            title: "Premium Beverage Service",
            description:
              "Licensed bar staff, custom cocktail design, and a curated wine list from regional vineyards.",
          },
          {
            icon: "✦",
            title: "On-Site Bridal Suite",
            description:
              "A private retreat with natural light, vanity stations, and dedicated entry.",
          },
          {
            icon: "✦",
            title: "Complimentary Parking",
            description: "Valet service available on request for up to 250 guests.",
          },
        ],
      },
      displayOrder: 2,
    },
    {
      blockType: "GallerySection",
      blockData: {
        eyebrow: "Gallery",
        heading: "A space that speaks for itself",
        layout: "masonry",
        columns: 3,
        gap: "normal",
        aspectRatio: "auto",
        images: [
          {
            url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
            alt: "Elegant candlelit reception",
          },
          {
            url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
            alt: "Garden ceremony setup",
          },
          {
            url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
            alt: "Grand ballroom",
          },
          {
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            alt: "Bridal suite",
          },
          {
            url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80",
            alt: "Cocktail lounge",
          },
          {
            url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
            alt: "Evening view",
          },
        ],
      },
      displayOrder: 3,
    },
    {
      blockType: "PricingTable",
      blockData: {
        eyebrow: "Packages",
        heading: "Two ways to celebrate",
        subheading:
          "Both packages are fully customizable and include full-service coordination.",
        plans: [
          {
            name: "Splendid",
            price: "$12,500",
            priceNote: "Starting at",
            description: "Our essential package for intimate gatherings up to 120 guests.",
            features: [
              "5-hour venue rental",
              "Ceremony & reception setup",
              "Dedicated event coordinator",
              "Premium linens & place settings",
              "On-site parking for 80",
            ],
            ctaLabel: "Reserve Splendid",
            ctaHref: "#cta",
            highlighted: false,
          },
          {
            name: "Luxury",
            price: "$22,500",
            priceNote: "Starting at",
            description: "Our signature package for up to 250 guests, all-inclusive.",
            features: [
              "8-hour venue rental",
              "Custom ceremony & reception design",
              "Lead coordinator + 2 assistants",
              "Premium linens, chairs, & tableware",
              "Valet parking & shuttle service",
              "Bridal suite with concierge",
              "Custom signature cocktail",
            ],
            ctaLabel: "Reserve Luxury",
            ctaHref: "#cta",
            highlighted: true,
          },
        ],
      },
      displayOrder: 4,
    },
    {
      blockType: "TestimonialSection",
      blockData: {
        eyebrow: "Stories",
        heading: "What our couples say",
        layout: "grid",
        testimonials: [
          {
            quote:
              "Maison Lumière felt like ours from the first walk-through. Every staff member treated our wedding like it was the most important event of their year.",
            authorName: "Alana & James",
            authorTitle: "Bride & Groom",
            eventType: "Wedding, 180 guests",
            rating: 5,
          },
          {
            quote:
              "We hosted our 20th anniversary gala here and the team handled everything — from the florals to the final toast. I barely had to think.",
            authorName: "Priya Mehta",
            authorTitle: "Host",
            eventType: "Corporate Gala, 220 guests",
            rating: 5,
          },
          {
            quote:
              "The space photographs beautifully, but what stays with you is how the team anticipates every need. A rare kind of hospitality.",
            authorName: "Marcus Chen",
            authorTitle: "Groom",
            eventType: "Wedding, 140 guests",
            rating: 5,
          },
        ],
      },
      displayOrder: 5,
    },
    {
      blockType: "CTASection",
      blockData: {
        eyebrow: "Visit Us",
        heading: "Come see the space in person",
        subheading:
          "Private tours are available Tuesday through Saturday. Bring your ideas — we'll walk the floor plan together.",
        primaryCtaLabel: "Book a Private Tour",
        primaryCtaHref: "#contact",
        secondaryCtaLabel: "Request a Proposal",
        secondaryCtaHref: "#contact",
        backgroundType: "image",
        backgroundValue:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80",
        overlayOpacity: 0.65,
        alignment: "center",
      },
      displayOrder: 6,
    },
  ];

  for (const b of blockRows) {
    await db.insert(blocks).values({
      pageId: homePageId,
      blockType: b.blockType,
      blockData: b.blockData,
      displayOrder: b.displayOrder,
      isVisible: true,
      isPublished: true,
      isCurrentDraft: false,
    });
  }

  console.log(`✓ Demo tenant seeded with ${blockRows.length} blocks.`);
  console.log("  Visit: /v/demo");
}

seedDemo()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
