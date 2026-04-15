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

// ------- FAQBlock -------

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional(),
});
export const faqBlockSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().default("Frequently Asked Questions"),
  subheading: z.string().optional(),
  faqs: z.array(faqItemSchema).min(1),
});
export type FAQBlockData = z.infer<typeof faqBlockSchema>;

// ------- TourBookingBlock -------

export const tourBookingBlockSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().default("Book a private tour"),
  subheading: z.string().optional(),
  introText: z.string().optional(),
  availableDays: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
    .default(["tue", "wed", "thu", "fri", "sat"]),
  slotTimes: z.array(z.string()).default(["10:00", "14:00", "16:00"]),
  successMessage: z.string().default("Your tour is confirmed. We'll be in touch shortly."),
});
export type TourBookingBlockData = z.infer<typeof tourBookingBlockSchema>;

// ------- AvailabilityBlock -------

export const availabilityBlockSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().default("Availability"),
  subheading: z.string().optional(),
  monthsAhead: z.number().int().min(1).max(12).default(3),
});
export type AvailabilityBlockData = z.infer<typeof availabilityBlockSchema>;

// ------- ContactFormBlock -------

export const contactFormBlockSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().default("Get in touch"),
  subheading: z.string().optional(),
  submitLabel: z.string().default("Send Inquiry"),
  successMessage: z.string().default("Thanks — we'll be in touch soon."),
  background: z.enum(["primary", "secondary"]).default("secondary"),
});
export type ContactFormBlockData = z.infer<typeof contactFormBlockSchema>;

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
  FAQBlock: {
    label: "FAQs",
    schema: faqBlockSchema,
    defaults: {
      heading: "Frequently Asked Questions",
      faqs: [
        { question: "How far in advance should we book?", answer: "We recommend booking 6–12 months in advance for weekend dates." },
        { question: "Is catering included?", answer: "We work with a curated list of preferred caterers — pricing varies." },
      ],
    } satisfies Partial<FAQBlockData>,
  },
  TourBookingBlock: {
    label: "Book a Tour",
    schema: tourBookingBlockSchema,
    defaults: {
      heading: "Book a private tour",
      subheading: "Walk the space with us. Tours take about 45 minutes.",
      availableDays: ["tue", "wed", "thu", "fri", "sat"],
      slotTimes: ["10:00", "14:00", "16:00"],
      successMessage: "Your tour is confirmed. We'll email you with directions and parking details.",
    } satisfies Partial<TourBookingBlockData>,
  },
  AvailabilityBlock: {
    label: "Availability Calendar",
    schema: availabilityBlockSchema,
    defaults: {
      heading: "Availability",
      subheading: "Check available dates before your inquiry.",
      monthsAhead: 3,
    } satisfies Partial<AvailabilityBlockData>,
  },
  ContactFormBlock: {
    label: "Contact Form",
    schema: contactFormBlockSchema,
    defaults: {
      heading: "Get in touch",
      submitLabel: "Send Inquiry",
      successMessage: "Thanks — we'll be in touch soon.",
      background: "secondary",
    } satisfies Partial<ContactFormBlockData>,
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
