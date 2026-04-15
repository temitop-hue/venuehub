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

export interface TemplateParams {
  venueName: string;
  city: string;
  state: string;
  primaryEventType: string;
  capacity: number;
}

const HERO_IMG = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80";
const VENUE_IMG = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80";
const GALLERY_IMGS = [
  { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", alt: "Candlelit reception" },
  { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80", alt: "Garden ceremony" },
  { url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80", alt: "Grand ballroom" },
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", alt: "Venue interior" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80", alt: "Lounge setting" },
  { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80", alt: "Evening view" },
];

export function buildSitePages(params: TemplateParams): TemplatePage[] {
  const { venueName, city, state, primaryEventType, capacity } = params;
  const location = city && state ? `${city}, ${state}` : city || state || "";

  const home = buildHomePage(params);
  const ourVenue: TemplatePage = {
    slug: "our-venue",
    title: "Our Venue",
    metaTitle: `Our Venue — ${venueName}`,
    metaDescription: `Tour the spaces, amenities, and details that make ${venueName} special.`,
    displayOrder: 1,
    blocks: [
      {
        blockType: "HeroBlock",
        displayOrder: 0,
        blockData: {
          headline: "Inside our venue",
          subheadline: location ? `An intimate look at our spaces in ${location}.` : "An intimate look at our spaces.",
          backgroundType: "image",
          backgroundUrl: VENUE_IMG,
          overlayOpacity: 0.45,
          ctaLabel: "Book a Tour",
          ctaHref: "/v/__SLUG__/book-a-tour",
          alignment: "center",
          height: "large",
        },
      },
      {
        blockType: "TextSection",
        displayOrder: 1,
        blockData: {
          eyebrow: "The Space",
          heading: "Designed for the moments that matter",
          body: `From the soaring ceilings of our grand hall to the quiet retreat of our bridal suite, every corner of ${venueName} was crafted with intention. Whether you're hosting an intimate dinner or a celebration for ${capacity} guests, the space adapts around your vision.`,
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
          eyebrow: "Amenities",
          heading: "Everything included",
          layout: "grid",
          columns: 3,
          features: [
            { icon: "✦", title: "Grand Hall", description: `Our main event space accommodates up to ${capacity} guests with flexible floor plans.` },
            { icon: "✦", title: "Outdoor Terrace", description: "A landscaped patio for cocktail hours and ceremonies." },
            { icon: "✦", title: "Bridal Suite", description: "A private retreat with natural light and dedicated entry." },
            { icon: "✦", title: "Catering Kitchen", description: "Commercial-grade prep space for our partner caterers." },
            { icon: "✦", title: "On-Site Parking", description: "Complimentary parking with valet available." },
            { icon: "✦", title: "AV & Lighting", description: "Professional sound, lighting, and projection built in." },
          ],
        },
      },
      {
        blockType: "GallerySection",
        displayOrder: 3,
        blockData: {
          eyebrow: "Spaces",
          heading: "Walk through with us",
          layout: "grid",
          columns: 3,
          gap: "normal",
          aspectRatio: "landscape",
          images: GALLERY_IMGS.slice(0, 6),
        },
      },
      {
        blockType: "CTASection",
        displayOrder: 4,
        blockData: {
          eyebrow: "See It For Yourself",
          heading: "Book a private tour",
          subheading: "Walk the floor plan with our team. Tours typically take 45 minutes.",
          primaryCtaLabel: "Schedule a Tour",
          primaryCtaHref: "/v/__SLUG__/book-a-tour",
          backgroundType: "image",
          backgroundValue: VENUE_IMG,
          overlayOpacity: 0.6,
          alignment: "center",
        },
      },
    ],
  };

  const gallery: TemplatePage = {
    slug: "gallery",
    title: "Gallery",
    metaTitle: `Gallery — ${venueName}`,
    metaDescription: `A look at past events at ${venueName}.`,
    displayOrder: 2,
    blocks: [
      {
        blockType: "HeroBlock",
        displayOrder: 0,
        blockData: {
          headline: "Moments at " + venueName,
          subheadline: "A glimpse of the celebrations that have happened here.",
          backgroundType: "image",
          backgroundUrl: GALLERY_IMGS[0].url,
          overlayOpacity: 0.4,
          alignment: "center",
          height: "medium",
        },
      },
      {
        blockType: "GallerySection",
        displayOrder: 1,
        blockData: {
          layout: "masonry",
          columns: 3,
          gap: "normal",
          aspectRatio: "auto",
          images: GALLERY_IMGS,
        },
      },
    ],
  };

  const packagesPage: TemplatePage = {
    slug: "packages",
    title: "Packages & Pricing",
    metaTitle: `Packages — ${venueName}`,
    metaDescription: `Pricing and packages for events at ${venueName}.`,
    displayOrder: 3,
    blocks: [
      {
        blockType: "HeroBlock",
        displayOrder: 0,
        blockData: {
          headline: "Packages & Pricing",
          subheadline: "Two ways to celebrate. Both fully customizable.",
          backgroundType: "image",
          backgroundUrl: VENUE_IMG,
          overlayOpacity: 0.5,
          alignment: "center",
          height: "medium",
        },
      },
      {
        blockType: "PricingTable",
        displayOrder: 1,
        blockData: {
          eyebrow: "Choose Your Experience",
          heading: "Two ways to celebrate",
          subheading: "Both packages include full-service coordination and can be tailored to your event.",
          plans: [
            {
              name: "Essential",
              price: "$X,XXX",
              priceNote: "Starting at",
              description: `For intimate gatherings up to ${Math.floor(capacity / 2)} guests.`,
              features: ["5-hour venue rental", "Ceremony & reception setup", "Dedicated event coordinator", "Premium linens & place settings"],
              ctaLabel: "Inquire",
              ctaHref: "/v/__SLUG__/contact",
              highlighted: false,
            },
            {
              name: "Signature",
              price: "$XX,XXX",
              priceNote: "Starting at",
              description: `Our signature all-inclusive package for up to ${capacity} guests.`,
              features: ["8-hour venue rental", "Custom design & floor plan", "Lead coordinator + 2 assistants", "Premium linens, chairs, & tableware", "Valet parking & concierge", "Bridal suite with concierge"],
              ctaLabel: "Inquire",
              ctaHref: "/v/__SLUG__/contact",
              highlighted: true,
            },
          ],
        },
      },
      {
        blockType: "ContactFormBlock",
        displayOrder: 2,
        blockData: {
          eyebrow: "Get a Quote",
          heading: "Tell us about your event",
          subheading: "Share a few details and we'll send personalized pricing within one business day.",
          submitLabel: "Request a Quote",
          successMessage: "Thanks — your quote request is in. Expect to hear from us soon.",
          background: "secondary",
        },
      },
    ],
  };

  const contact: TemplatePage = {
    slug: "contact",
    title: "Contact",
    metaTitle: `Contact ${venueName}`,
    metaDescription: `Get in touch with ${venueName}.`,
    displayOrder: 4,
    blocks: [
      {
        blockType: "HeroBlock",
        displayOrder: 0,
        blockData: {
          headline: "Get in touch",
          subheadline: "Tell us about your event and we'll be in touch within one business day.",
          backgroundType: "image",
          backgroundUrl: VENUE_IMG,
          overlayOpacity: 0.55,
          alignment: "center",
          height: "medium",
        },
      },
      {
        blockType: "ContactFormBlock",
        displayOrder: 1,
        blockData: {
          eyebrow: "Inquire",
          heading: "Send us a message",
          subheading: "We respond to every inquiry personally — no auto-replies.",
          submitLabel: "Send Inquiry",
          successMessage: `Thank you — our team will reach out soon. In the meantime, we can't wait to show you around ${venueName}.`,
          background: "secondary",
        },
      },
    ],
  };

  return [home, ourVenue, gallery, packagesPage, contact];
}

export function buildHomePage(params: TemplateParams): TemplatePage {
  const { venueName, city, state, primaryEventType, capacity } = params;
  const location = city && state ? `${city}, ${state}` : "";

  return {
    slug: "home",
    title: "Home",
    metaTitle: location ? `${venueName} — ${primaryEventType} in ${location}` : `${venueName}`,
    metaDescription: location
      ? `Host ${primaryEventType.toLowerCase()} and unforgettable events at ${venueName} in ${location}.`
      : `Host ${primaryEventType.toLowerCase()} and unforgettable events at ${venueName}.`,
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
        blockType: "ContactFormBlock",
        displayOrder: 6,
        blockData: {
          eyebrow: "Start a Conversation",
          heading: "Inquire about your event",
          subheading: "Share a few details and we'll get back to you within one business day.",
          submitLabel: "Send Inquiry",
          successMessage: `Thank you — our team will reach out soon. In the meantime, we can't wait to show you around ${venueName}.`,
          background: "secondary",
        },
      },
      {
        blockType: "CTASection",
        displayOrder: 7,
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
