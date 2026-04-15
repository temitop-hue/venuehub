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
  | { kind: "media"; accept: "image" | "video" | "image-or-video"; placeholder?: string }
  | { kind: "arrayOfStrings"; itemLabel?: string; placeholder?: string }
  | { kind: "arrayOfObjects"; itemLabel: string; fields: FieldDef[]; titleField?: string }
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
      label: "Background media",
      type: { kind: "media", accept: "image-or-video" },
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
      type: {
        kind: "arrayOfObjects",
        itemLabel: "Image",
        titleField: "alt",
        fields: [
          { name: "url", label: "Image", type: { kind: "media", accept: "image" } },
          { name: "alt", label: "Alt text", type: { kind: "text", placeholder: "Short description for screen readers" } },
          { name: "caption", label: "Caption (optional)", type: { kind: "text" } },
        ],
      },
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
      type: {
        kind: "arrayOfObjects",
        itemLabel: "Feature",
        titleField: "title",
        fields: [
          { name: "title", label: "Title", type: { kind: "text" } },
          { name: "description", label: "Description", type: { kind: "textarea", rows: 2 } },
          { name: "icon", label: "Icon (emoji or symbol)", type: { kind: "text", placeholder: "✦" } },
          { name: "imageUrl", label: "Image (optional)", type: { kind: "media", accept: "image" } },
        ],
      },
    },
  ],
  PricingTable: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    {
      name: "plans",
      label: "Plans",
      type: {
        kind: "arrayOfObjects",
        itemLabel: "Plan",
        titleField: "name",
        fields: [
          { name: "name", label: "Name", type: { kind: "text", placeholder: "Signature" } },
          { name: "price", label: "Price", type: { kind: "text", placeholder: "$12,500" } },
          { name: "priceNote", label: "Price note", type: { kind: "text", placeholder: "Starting at" } },
          { name: "description", label: "Description", type: { kind: "textarea", rows: 2 } },
          {
            name: "features",
            label: "Included features",
            type: { kind: "arrayOfStrings", itemLabel: "Feature", placeholder: "e.g. 5-hour venue rental" },
          },
          { name: "ctaLabel", label: "CTA label", type: { kind: "text" } },
          { name: "ctaHref", label: "CTA link", type: { kind: "text" } },
          { name: "highlighted", label: "Highlight as featured", type: { kind: "boolean" } },
        ],
      },
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
      type: {
        kind: "arrayOfObjects",
        itemLabel: "Testimonial",
        titleField: "authorName",
        fields: [
          { name: "quote", label: "Quote", type: { kind: "textarea", rows: 4 } },
          { name: "authorName", label: "Author name", type: { kind: "text" } },
          { name: "authorTitle", label: "Author title", type: { kind: "text", placeholder: "Bride & Groom" } },
          { name: "eventType", label: "Event type", type: { kind: "text", placeholder: "Wedding, 180 guests" } },
          { name: "rating", label: "Rating (1–5)", type: { kind: "number", min: 1, max: 5, step: 1 } },
          { name: "imageUrl", label: "Author photo (optional)", type: { kind: "media", accept: "image" } },
        ],
      },
    },
  ],
  ContactFormBlock: [
    { name: "eyebrow", label: "Eyebrow", type: { kind: "text" } },
    { name: "heading", label: "Heading", type: { kind: "text" } },
    { name: "subheading", label: "Subheading", type: { kind: "textarea", rows: 2 } },
    { name: "submitLabel", label: "Submit button label", type: { kind: "text" } },
    {
      name: "successMessage",
      label: "Success message",
      description: "Shown after a visitor submits the form.",
      type: { kind: "textarea", rows: 2 },
    },
    {
      name: "background",
      label: "Background",
      type: {
        kind: "select",
        options: [
          { value: "secondary", label: "Secondary (light)" },
          { value: "primary", label: "Primary (dark)" },
        ],
      },
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
      label: "Background image",
      description: "Image behind the CTA. For a solid color instead, set Background to 'color' and paste a hex like #0d0d0d here.",
      type: { kind: "media", accept: "image" },
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
