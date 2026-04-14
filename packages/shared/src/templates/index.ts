export type Tone = "luxury" | "modern" | "minimal" | "classic" | "corporate";

export interface ToneTheme {
  tone: Tone;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  heroOverlayOpacity: number;
  borderRadius: number;
}

export const TONE_PRESETS: Record<Tone, ToneTheme> = {
  luxury: {
    tone: "luxury",
    primaryColor: "#0d0d0d",
    secondaryColor: "#f7f3ea",
    accentColor: "#c9a86a",
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    heroOverlayOpacity: 0.5,
    borderRadius: 2,
  },
  modern: {
    tone: "modern",
    primaryColor: "#111111",
    secondaryColor: "#ffffff",
    accentColor: "#3b82f6",
    headingFont: "Inter",
    bodyFont: "Inter",
    heroOverlayOpacity: 0.35,
    borderRadius: 8,
  },
  minimal: {
    tone: "minimal",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
    headingFont: "Inter",
    bodyFont: "Inter",
    heroOverlayOpacity: 0.2,
    borderRadius: 0,
  },
  classic: {
    tone: "classic",
    primaryColor: "#3a2e2a",
    secondaryColor: "#faf0e6",
    accentColor: "#c48a8a",
    headingFont: "Cormorant Garamond",
    bodyFont: "Lato",
    heroOverlayOpacity: 0.35,
    borderRadius: 4,
  },
  corporate: {
    tone: "corporate",
    primaryColor: "#0f172a",
    secondaryColor: "#ffffff",
    accentColor: "#0ea5e9",
    headingFont: "Inter",
    bodyFont: "Inter",
    heroOverlayOpacity: 0.45,
    borderRadius: 4,
  },
};

export interface TemplateBlock {
  blockType: string;
  displayOrder: number;
  blockData: Record<string, unknown>;
}

export interface TemplatePage {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  displayOrder: number;
  blocks: TemplateBlock[];
}

const placeholder = (name: string, location: string) => ({
  url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80",
  alt: `${name} at ${location}`,
});

export function buildHomeTemplate(params: {
  venueName: string;
  city: string;
  state: string;
  primaryEventType: string;
  capacity: number;
}): TemplatePage {
  const { venueName, city, state, primaryEventType, capacity } = params;
  const location = `${city}, ${state}`;

  return {
    slug: "home",
    title: "Home",
    metaTitle: `${venueName} — ${primaryEventType} in ${location}`,
    metaDescription: `Host ${primaryEventType.toLowerCase()} and unforgettable events at ${venueName} in ${location}.`,
    displayOrder: 0,
    blocks: [
      {
        blockType: "HeroBlock",
        displayOrder: 0,
        blockData: {
          headline: `Where moments become memories`,
          subheadline: `${venueName} — a premier event venue in ${location}. Host ${primaryEventType.toLowerCase()}, galas, and private celebrations for up to ${capacity} guests.`,
          backgroundType: "image",
          backgroundUrl:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80",
          overlayOpacity: 0.5,
          ctaLabel: "Book a Private Tour",
          ctaHref: "#cta",
          alignment: "center",
          height: "screen",
        },
      },
      {
        blockType: "TextSection",
        displayOrder: 1,
        blockData: {
          eyebrow: "Our Story",
          heading: `Welcome to ${venueName}`,
          body: `Set in the heart of ${location}, ${venueName} pairs timeless architecture with modern hospitality. From first site visit to final toast, our team handles every detail — so you can be fully present for the moments that matter.`,
          alignment: "center",
          maxWidth: "medium",
          background: "secondary",
          paddingY: "xl",
        },
      },
      {
        blockType: "FeatureList",
        displayOrder: 2,
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
              description: `Ceremony, reception, cocktail hour — all for up to ${capacity} guests in one seamless footprint.`,
            },
          ],
        },
      },
      {
        blockType: "GallerySection",
        displayOrder: 3,
        blockData: {
          eyebrow: "Gallery",
          heading: "A space that speaks for itself",
          layout: "masonry",
          columns: 3,
          gap: "normal",
          aspectRatio: "auto",
          images: [
            { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", alt: "Candlelit reception" },
            { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80", alt: "Garden ceremony" },
            { url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80", alt: "Grand ballroom" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", alt: "Venue interior" },
            { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80", alt: "Lounge setting" },
            { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80", alt: "Evening view" },
          ],
        },
      },
      {
        blockType: "PricingTable",
        displayOrder: 4,
        blockData: {
          eyebrow: "Packages",
          heading: "Two ways to celebrate",
          subheading: "Both packages are fully customizable and include full-service coordination.",
          plans: [
            {
              name: "Essential",
              price: "$X,XXX",
              priceNote: "Starting at",
              description: `For intimate gatherings up to ${Math.floor(capacity / 2)} guests.`,
              features: [
                "5-hour venue rental",
                "Ceremony & reception setup",
                "Dedicated event coordinator",
                "Premium linens & place settings",
              ],
              ctaLabel: "Reserve Essential",
              ctaHref: "#cta",
              highlighted: false,
            },
            {
              name: "Signature",
              price: "$XX,XXX",
              priceNote: "Starting at",
              description: `Our signature all-inclusive package for up to ${capacity} guests.`,
              features: [
                "8-hour venue rental",
                "Custom ceremony & reception design",
                "Lead coordinator + 2 assistants",
                "Premium linens, chairs, & tableware",
                "Valet parking & concierge",
              ],
              ctaLabel: "Reserve Signature",
              ctaHref: "#cta",
              highlighted: true,
            },
          ],
        },
      },
      {
        blockType: "TestimonialSection",
        displayOrder: 5,
        blockData: {
          eyebrow: "Stories",
          heading: "What our couples say",
          layout: "grid",
          testimonials: [
            {
              quote: `${venueName} felt like ours from the first walk-through. Every staff member treated our event like it was the most important of their year.`,
              authorName: "Alana & James",
              authorTitle: "Bride & Groom",
              eventType: "Wedding",
              rating: 5,
            },
            {
              quote: "The team handled everything — from florals to the final toast. I barely had to think.",
              authorName: "Priya Mehta",
              authorTitle: "Host",
              eventType: "Corporate Gala",
              rating: 5,
            },
            {
              quote: "The space photographs beautifully, but what stays with you is how the team anticipates every need.",
              authorName: "Marcus Chen",
              authorTitle: "Groom",
              eventType: "Wedding",
              rating: 5,
            },
          ],
        },
      },
      {
        blockType: "CTASection",
        displayOrder: 6,
        blockData: {
          eyebrow: "Visit Us",
          heading: "Come see the space in person",
          subheading: "Private tours available Tuesday through Saturday. Bring your ideas — we'll walk the floor plan together.",
          primaryCtaLabel: "Book a Private Tour",
          primaryCtaHref: "#contact",
          secondaryCtaLabel: "Request a Proposal",
          secondaryCtaHref: "#contact",
          backgroundType: "image",
          backgroundValue: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80",
          overlayOpacity: 0.65,
          alignment: "center",
        },
      },
    ],
  };
}
