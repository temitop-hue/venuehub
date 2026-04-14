// UI field metadata for the block editor. Describes how to render each
// block's JSON payload as a form. Kept deliberately decoupled from the
// Zod schemas so the editor can stay simple without introspecting Zod
// internals.

export type FieldType =
  | { kind: "text"; placeholder?: string }
  | { kind: "textarea"; placeholder?: string; rows?: number }
  | { kind: "url"; placeholder?: string }
  | { kind: "number"; min?: number; max?: number; step?: number }
  | { kind: "boolean" }
  | { kind: "select"; options: { value: string; label: string }[] }
  | { kind: "json"; placeholder?: string };

export interface FieldDef {
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  defaultValue?: unknown;
}

const alignmentOptions = (values: string[] = ["left", "center", "right"]) =>
  values.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

export const BLOCK_FIELDS: Record<string, FieldDef[]> = {
  HeroBlock: [
    { name: "headline", label: "Headline", type: { kind: "text" } },
    { name: "subheadline", label: "Subheadline", type: { kind: "textarea", rows: 2 } },
    {
      name: "backgroundType",
      label: "Background",
      type: { kind: "select", options: alignmentOptions(["image", "video"]) },
    },
    {
      name: "backgroundUrl",
      label: "Background URL",
      type: { kind: "url", placeholder: "https://…" },
    },
    {
      name: "overlayOpacity",
      label: "Overlay opacity",
      type: { kind: "number", min: 0, max: 1, step: 0.05 },
    },
    { name: "ctaLabel", label: "CTA label", type: { kind: "text" } },
    { name: "ctaHref", label: "CTA link", type: { kind: "text", placeholder: "#contact or /book" } },
    { name: "alignment", label: "Alignment", type: { kind: "select", options: alignmentOptions() } },
    {
      name: "height",
      label: "Height",
      type: { kind: "select", options: alignmentOptions(["screen", "large", "medium"]) },
    },
  ],
  TextSection: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "body", label: "Body", type: { kind: "textarea", rows: 6 } },
    { name: "alignment", label: "Alignment", type: { kind: "select", options: alignmentOptions() } },
    {
      name: "maxWidth",
      label: "Width",
      type: { kind: "select", options: alignmentOptions(["narrow", "medium", "wide"]) },
    },
    {
      name: "background",
      label: "Background",
      type: {
        kind: "select",
        options: alignmentOptions(["primary", "secondary", "accent", "transparent"]),
      },
    },
    {
      name: "paddingY",
      label: "Vertical padding",
      type: { kind: "select", options: alignmentOptions(["sm", "md", "lg", "xl"]) },
    },
  ],
  GallerySection: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    {
      name: "layout",
      label: "Layout",
      type: { kind: "select", options: alignmentOptions(["grid", "masonry"]) },
    },
    {
      name: "columns",
      label: "Columns",
      type: { kind: "select", options: [
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ] },
    },
    {
      name: "aspectRatio",
      label: "Aspect ratio",
      type: { kind: "select", options: alignmentOptions(["square", "portrait", "landscape", "auto"]) },
    },
    {
      name: "gap",
      label: "Gap",
      type: { kind: "select", options: alignmentOptions(["tight", "normal", "airy"]) },
    },
    {
      name: "images",
      label: "Images",
      description: "Array of { url, alt, caption? }",
      type: { kind: "json", placeholder: '[{"url":"https://…","alt":"…"}]' },
    },
  ],
  FeatureList: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    {
      name: "layout",
      label: "Layout",
      type: { kind: "select", options: alignmentOptions(["grid", "alternating"]) },
    },
    {
      name: "columns",
      label: "Columns",
      type: { kind: "select", options: [
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ] },
    },
    {
      name: "features",
      label: "Features",
      description: "Array of { title, description?, icon?, imageUrl? }",
      type: { kind: "json" },
    },
  ],
  PricingTable: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    {
      name: "plans",
      label: "Plans",
      description: "Array of { name, price, priceNote?, description?, features[], ctaLabel?, ctaHref?, highlighted }",
      type: { kind: "json" },
    },
  ],
  TestimonialSection: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    {
      name: "layout",
      label: "Layout",
      type: { kind: "select", options: alignmentOptions(["grid", "single", "carousel"]) },
    },
    {
      name: "testimonials",
      label: "Testimonials",
      description: "Array of { quote, authorName, authorTitle?, eventType?, rating?, imageUrl? }",
      type: { kind: "json" },
    },
  ],
  CTASection: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    { name: "primaryCtaLabel", label: "Primary CTA label", type: { kind: "text" } },
    { name: "primaryCtaHref", label: "Primary CTA link", type: { kind: "text" } },
    { name: "secondaryCtaLabel", label: "Secondary CTA label", type: { kind: "text" } },
    { name: "secondaryCtaHref", label: "Secondary CTA link", type: { kind: "text" } },
    {
      name: "backgroundType",
      label: "Background",
      type: { kind: "select", options: alignmentOptions(["color", "image"]) },
    },
    {
      name: "backgroundValue",
      label: "Background value",
      description: "Hex color (e.g. #0d0d0d) or image URL",
      type: { kind: "text" },
    },
    {
      name: "overlayOpacity",
      label: "Overlay opacity",
      type: { kind: "number", min: 0, max: 1, step: 0.05 },
    },
    {
      name: "alignment",
      label: "Alignment",
      type: { kind: "select", options: alignmentOptions(["left", "center"]) },
    },
  ],
};
