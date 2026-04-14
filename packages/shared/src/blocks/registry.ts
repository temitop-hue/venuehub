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
