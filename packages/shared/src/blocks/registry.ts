import { z } from "zod";

// ------- HeroBlock -------

export const heroBlockSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  backgroundType: z.enum(["image", "video"]).default("image"),
  backgroundUrl: z.string().url(),
  overlayOpacity: z.number().min(0).max(1).default(0.45),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).default("center"),
  height: z.enum(["screen", "large", "medium"]).default("screen"),
});
export type HeroBlockData = z.infer<typeof heroBlockSchema>;

// ------- TextSection -------

export const textSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().min(1),
  alignment: z.enum(["left", "center", "right"]).default("center"),
  maxWidth: z.enum(["narrow", "medium", "wide"]).default("medium"),
  background: z.enum(["primary", "secondary", "accent", "transparent"]).default("secondary"),
  paddingY: z.enum(["sm", "md", "lg", "xl"]).default("lg"),
});
export type TextSectionData = z.infer<typeof textSectionSchema>;

// ------- GallerySection -------

export const galleryImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(""),
  caption: z.string().optional(),
});
export const gallerySectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  layout: z.enum(["grid", "masonry"]).default("masonry"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  aspectRatio: z.enum(["square", "portrait", "landscape", "auto"]).default("auto"),
  gap: z.enum(["tight", "normal", "airy"]).default("normal"),
  images: z.array(galleryImageSchema).min(1),
});
export type GallerySectionData = z.infer<typeof gallerySectionSchema>;

// ------- FeatureList -------

export const featureItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().url().optional(),
});
export const featureListSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  layout: z.enum(["grid", "alternating"]).default("grid"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  features: z.array(featureItemSchema).min(1),
});
export type FeatureListData = z.infer<typeof featureListSchema>;

// ------- PricingTable -------

export const pricingPlanSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  priceNote: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  highlighted: z.boolean().default(false),
});
export const pricingTableSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  plans: z.array(pricingPlanSchema).min(1).max(4),
});
export type PricingTableData = z.infer<typeof pricingTableSchema>;

// ------- TestimonialSection -------

export const testimonialItemSchema = z.object({
  quote: z.string().min(1),
  authorName: z.string().min(1),
  authorTitle: z.string().optional(),
  eventType: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  imageUrl: z.string().url().optional(),
});
export const testimonialSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  layout: z.enum(["grid", "single", "carousel"]).default("grid"),
  testimonials: z.array(testimonialItemSchema).min(1),
});
export type TestimonialSectionData = z.infer<typeof testimonialSectionSchema>;

// ------- CTASection -------

export const ctaSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  backgroundType: z.enum(["color", "image"]).default("color"),
  backgroundValue: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1).default(0.55),
  alignment: z.enum(["left", "center"]).default("center"),
});
export type CtaSectionData = z.infer<typeof ctaSectionSchema>;

// ------- Registry -------

export const blockRegistry = {
  HeroBlock: {
    label: "Hero",
    schema: heroBlockSchema,
    defaults: {
      headline: "Your Venue Name",
      backgroundType: "image",
      backgroundUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
      overlayOpacity: 0.45,
      alignment: "center",
      height: "screen",
    } satisfies Partial<HeroBlockData>,
  },
  TextSection: {
    label: "Text Section",
    schema: textSectionSchema,
    defaults: {
      body: "Tell your venue's story here.",
      alignment: "center",
      maxWidth: "medium",
      background: "secondary",
      paddingY: "lg",
    } satisfies Partial<TextSectionData>,
  },
  GallerySection: {
    label: "Gallery",
    schema: gallerySectionSchema,
    defaults: {
      layout: "masonry",
      columns: 3,
      aspectRatio: "auto",
      gap: "normal",
      images: [],
    } satisfies Partial<GallerySectionData>,
  },
  FeatureList: {
    label: "Feature List",
    schema: featureListSchema,
    defaults: {
      layout: "grid",
      columns: 3,
      features: [],
    } satisfies Partial<FeatureListData>,
  },
  PricingTable: {
    label: "Pricing",
    schema: pricingTableSchema,
    defaults: { plans: [] } satisfies Partial<PricingTableData>,
  },
  TestimonialSection: {
    label: "Testimonials",
    schema: testimonialSectionSchema,
    defaults: {
      layout: "grid",
      testimonials: [],
    } satisfies Partial<TestimonialSectionData>,
  },
  CTASection: {
    label: "Call to Action",
    schema: ctaSectionSchema,
    defaults: {
      heading: "Ready to book?",
      primaryCtaLabel: "Book a Tour",
      primaryCtaHref: "#contact",
      backgroundType: "color",
      alignment: "center",
      overlayOpacity: 0.55,
    } satisfies Partial<CtaSectionData>,
  },
} as const;

export type BlockType = keyof typeof blockRegistry;

export const isKnownBlockType = (type: string): type is BlockType =>
  type in blockRegistry;

export function parseBlockData<T extends BlockType>(
  type: T,
  data: unknown,
): z.infer<(typeof blockRegistry)[T]["schema"]> {
  return blockRegistry[type].schema.parse(data) as z.infer<
    (typeof blockRegistry)[T]["schema"]
  >;
}
