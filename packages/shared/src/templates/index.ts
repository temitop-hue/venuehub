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

export interface TemplateParams {
  venueName: string;
  city: string;
  state: string;
  primaryEventType: string;
  capacity: number;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface PlanItem {
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  highlighted: boolean;
}

interface TestimonialItem {
  quote: string;
  authorName: string;
  authorTitle?: string;
  eventType?: string;
  rating: number;
}

interface ToneContent {
  hero: {
    headline: string;
    subheadline: string;
    backgroundUrl: string;
    overlayOpacity: number;
    ctaLabel: string;
    alignment: "left" | "center" | "right";
    height: "screen" | "large" | "medium";
  };
  story: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  features: {
    eyebrow: string;
    heading: string;
    items: FeatureItem[];
  };
  galleryHeading: { eyebrow: string; heading: string; layout: "grid" | "masonry" };
  galleryImages: { url: string; alt: string }[];
  pricing: {
    eyebrow: string;
    heading: string;
    subheading: string;
    plans: [PlanItem, PlanItem];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    layout: "grid" | "single";
    items: TestimonialItem[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    subheading: string;
    submitLabel: string;
    successMessage: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    subheading: string;
    primaryCtaLabel: string;
    backgroundUrl: string;
    overlayOpacity: number;
  };
  ourVenue: {
    heroHeadline: string;
    heroSubheadline: string;
    heroImage: string;
    storyHeading: string;
    storyBody: string;
    amenitiesHeading: string;
  };
  galleryPage: {
    heroHeadline: string;
    heroSubheadline: string;
  };
  packagesPage: {
    heroHeadline: string;
    heroSubheadline: string;
  };
  contactPage: {
    heroHeadline: string;
    heroSubheadline: string;
  };
}

// ----------------------- TONE CONTENT PACKS -----------------------

const TONE_CONTENT: Record<Tone, (p: TemplateParams) => ToneContent> = {
  luxury: (p) => {
    const cap = p.capacity;
    const halfCap = Math.max(40, Math.floor(cap / 2));
    const location = p.city && p.state ? `${p.city}, ${p.state}` : p.city || "";
    return {
      hero: {
        headline: "Where moments become memories",
        subheadline: location
          ? `${p.venueName} — a luxury venue in ${location}. Host weddings, galas, and private celebrations crafted for the extraordinary.`
          : `${p.venueName} is a luxury venue crafted for weddings, galas, and private celebrations.`,
        backgroundUrl:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80",
        overlayOpacity: 0.5,
        ctaLabel: "Book a Private Tour",
        alignment: "center",
        height: "screen",
      },
      story: {
        eyebrow: "Our Story",
        heading: `Welcome to ${p.venueName}`,
        body: `Set within timeless architecture and modern hospitality, ${p.venueName} is a venue for moments that matter. From the first walk-through to the final toast, every detail is considered — so you can be fully present.`,
      },
      features: {
        eyebrow: "What's Included",
        heading: "An experience, not just a venue",
        items: [
          { icon: "✦", title: "Full-Service Coordination", description: "A dedicated event lead and day-of timeline management — start to finish." },
          { icon: "✦", title: "Curated Vendor Partners", description: "Hand-picked caterers, florists, and entertainers who know our space." },
          { icon: "✦", title: "Flexible Floor Plans", description: `Ceremony, reception, and lounges — all for up to ${cap} guests in one footprint.` },
          { icon: "✦", title: "Premium Beverage Service", description: "Licensed bar staff, custom cocktails, and a curated wine list." },
          { icon: "✦", title: "On-Site Bridal Suite", description: "A private retreat with natural light and a dedicated entry." },
          { icon: "✦", title: "Valet Parking", description: "Complimentary parking with valet service available." },
        ],
      },
      galleryHeading: { eyebrow: "Gallery", heading: "A space that speaks for itself", layout: "masonry" },
      galleryImages: [
        { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", alt: "Candlelit reception" },
        { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80", alt: "Garden ceremony" },
        { url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80", alt: "Grand ballroom" },
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", alt: "Venue interior" },
        { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80", alt: "Lounge setting" },
        { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80", alt: "Evening view" },
      ],
      pricing: {
        eyebrow: "Packages",
        heading: "Two ways to celebrate",
        subheading: "Both packages include full-service coordination and can be tailored to your event.",
        plans: [
          { name: "Essential", price: "$X,XXX", priceNote: "Starting at", description: `For intimate gatherings up to ${halfCap} guests.`, features: ["5-hour venue rental", "Ceremony & reception setup", "Dedicated event coordinator", "Premium linens & place settings"], ctaLabel: "Reserve Essential", highlighted: false },
          { name: "Signature", price: "$XX,XXX", priceNote: "Starting at", description: `Our signature all-inclusive package for up to ${cap} guests.`, features: ["8-hour venue rental", "Custom ceremony & reception design", "Lead coordinator + 2 assistants", "Premium tableware & valet service", "Bridal suite with concierge"], ctaLabel: "Reserve Signature", highlighted: true },
        ],
      },
      testimonials: {
        eyebrow: "Stories",
        heading: "What our couples say",
        layout: "grid",
        items: [
          { quote: `${p.venueName} felt like ours from the first walk-through. Every staff member treated our wedding like the most important event of their year.`, authorName: "Alana & James", authorTitle: "Bride & Groom", eventType: "Wedding · 180 guests", rating: 5 },
          { quote: "We hosted our 20th anniversary gala here and the team handled everything — florals to the final toast.", authorName: "Priya Mehta", authorTitle: "Host", eventType: "Gala · 220 guests", rating: 5 },
          { quote: "The space photographs beautifully, but what stays with you is how the team anticipates every need.", authorName: "Marcus Chen", authorTitle: "Groom", eventType: "Wedding · 140 guests", rating: 5 },
        ],
      },
      contact: {
        eyebrow: "Start a Conversation",
        heading: "Inquire about your event",
        subheading: "Share a few details and we'll respond within one business day.",
        submitLabel: "Send Inquiry",
        successMessage: `Thank you — our team will reach out soon. We can't wait to show you around ${p.venueName}.`,
      },
      cta: {
        eyebrow: "Visit Us",
        heading: "Come see the space in person",
        subheading: "Private tours are available Tuesday through Saturday. Walk the floor plan with our team.",
        primaryCtaLabel: "Book a Private Tour",
        backgroundUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80",
        overlayOpacity: 0.65,
      },
      ourVenue: {
        heroHeadline: "Inside our venue",
        heroSubheadline: location ? `An intimate look at our spaces in ${location}.` : "An intimate look at our spaces.",
        heroImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80",
        storyHeading: "Designed for the moments that matter",
        storyBody: `From the soaring ceilings of our grand hall to the quiet retreat of our bridal suite, every corner of ${p.venueName} was crafted with intention. The space adapts to your vision — intimate or grand.`,
        amenitiesHeading: "Everything included",
      },
      galleryPage: {
        heroHeadline: `Moments at ${p.venueName}`,
        heroSubheadline: "A glimpse of the celebrations that have happened here.",
      },
      packagesPage: {
        heroHeadline: "Packages & Pricing",
        heroSubheadline: "Two ways to celebrate. Both fully customizable.",
      },
      contactPage: {
        heroHeadline: "Get in touch",
        heroSubheadline: "Tell us about your event and we'll be in touch within one business day.",
      },
    };
  },

  modern: (p) => {
    const cap = p.capacity;
    const halfCap = Math.max(40, Math.floor(cap / 2));
    return {
      hero: {
        headline: "Host. Celebrate. Repeat.",
        subheadline: `${p.venueName} is a versatile event space designed for ambitious teams, modern brands, and unforgettable celebrations — built for up to ${cap} guests.`,
        backgroundUrl:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2400&q=80",
        overlayOpacity: 0.4,
        ctaLabel: "Plan an Event",
        alignment: "left",
        height: "screen",
      },
      story: {
        eyebrow: "About",
        heading: "A space that adapts to your event",
        body: `Geometric design. Editorial whitespace. Industrial bones. ${p.venueName} is the modern alternative to the predictable hotel ballroom — a place where a product launch can become a wedding can become a brand activation, all in the same week.`,
      },
      features: {
        eyebrow: "Built For",
        heading: "Whatever you're planning",
        items: [
          { icon: "■", title: "Modular Floor Plans", description: "Reconfigure walls and seating in minutes — no contractors required." },
          { icon: "■", title: "Production-Ready AV", description: "4K projectors, professional lighting, line-array sound. Plug and run." },
          { icon: "■", title: "Open Catering", description: "Bring any caterer. We have the prep kitchen and licensed bar to back them up." },
        ],
      },
      galleryHeading: { eyebrow: "Spaces", heading: "Inside the venue", layout: "grid" },
      galleryImages: [
        { url: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80", alt: "Open event hall" },
        { url: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80", alt: "Modern lounge" },
        { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80", alt: "Stage setup" },
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", alt: "Networking lounge" },
        { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80", alt: "Event in progress" },
        { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80", alt: "Brand activation" },
      ],
      pricing: {
        eyebrow: "Pricing",
        heading: "Three ways to book",
        subheading: "Transparent pricing. No hidden fees. Custom multi-day rates available.",
        plans: [
          { name: "Studio", price: "$XXX", priceNote: "Per hour", description: `Pop-ups, dinners, intimate workshops up to ${halfCap} people.`, features: ["3-hour minimum", "Full AV access", "Open catering", "Setup + breakdown crew"], ctaLabel: "Book Studio", highlighted: false },
          { name: "Studio Pro", price: "$X,XXX", priceNote: "Per day", description: `Full-venue buyouts up to ${cap} guests, all-day production access.`, features: ["12-hour event window", "Production lead + 2 crew", "Custom floor plan design", "Premium AV package", "Bar service included"], ctaLabel: "Book Studio Pro", highlighted: true },
        ],
      },
      testimonials: {
        eyebrow: "Receipts",
        heading: "Real teams. Real events.",
        layout: "grid",
        items: [
          { quote: `${p.venueName} ran our product launch like clockwork. Booked Friday, ran the show Saturday — and the room looked custom-built for the brand.`, authorName: "Sasha Lin", authorTitle: "Head of Brand", eventType: "Product Launch · 320 guests", rating: 5 },
          { quote: "We've hosted four events here in the last year — every one different, every one easy to pull off.", authorName: "Devon Ortega", authorTitle: "Marketing Director", eventType: "Quarterly Series", rating: 5 },
          { quote: "Modern, well-lit, and the AV team actually knows what they're doing. That's rare.", authorName: "Mira Patel", authorTitle: "Producer", eventType: "Tech Conference · 500 guests", rating: 5 },
        ],
      },
      contact: {
        eyebrow: "Inquire",
        heading: "Tell us what you're planning",
        subheading: "We'll send pricing, available dates, and a floor-plan PDF within 24 hours.",
        submitLabel: "Get a Quote",
        successMessage: `Got it. We'll be back to you with pricing and availability within a business day.`,
      },
      cta: {
        eyebrow: "Visit",
        heading: "Tour the space",
        subheading: "30-minute walkthroughs, weekday afternoons. We'll show you the room, the rigging, and the kitchen.",
        primaryCtaLabel: "Schedule a Walk-Through",
        backgroundUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=2000&q=80",
        overlayOpacity: 0.5,
      },
      ourVenue: {
        heroHeadline: "The space",
        heroSubheadline: "10,000 square feet of configurable event surface.",
        heroImage: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=2000&q=80",
        storyHeading: "One venue. Endless setups.",
        storyBody: `${p.venueName} was designed to be a blank slate. Soaring ceilings, polished concrete, retractable walls, and a 30-foot LED truss. Throw a runway show on Friday, host a board meeting on Monday — same room.`,
        amenitiesHeading: "What's in the box",
      },
      galleryPage: {
        heroHeadline: "Past events",
        heroSubheadline: "A few of our favorites.",
      },
      packagesPage: {
        heroHeadline: "Pricing",
        heroSubheadline: "Hourly for small. Day rates for big. Multi-day on request.",
      },
      contactPage: {
        heroHeadline: "Plan an event",
        heroSubheadline: "Send the basics — we'll send back a quote and a floor plan.",
      },
    };
  },

  minimal: (p) => {
    return {
      hero: {
        headline: "An honest space.",
        subheadline: `${p.venueName}. Bring your event. We'll handle the room.`,
        backgroundUrl:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2400&q=80",
        overlayOpacity: 0.25,
        ctaLabel: "Book",
        alignment: "left",
        height: "large",
      },
      story: {
        eyebrow: "—",
        heading: "Less is more.",
        body: `White walls. Wood floors. Daylight. ${p.venueName} is purposefully spare so your event — your people, your design, your meal — can be the only thing in the room.`,
      },
      features: {
        eyebrow: "Inclusions",
        heading: "What you get",
        items: [
          { icon: "·", title: "The room", description: "All of it. No shared spaces. No interruptions." },
          { icon: "·", title: "Tables & chairs", description: "Wood, neutral, plenty." },
          { icon: "·", title: "Sound", description: "Discreet, capable, controllable." },
          { icon: "·", title: "Daylight", description: "North-facing windows. East-facing courtyard." },
        ],
      },
      galleryHeading: { eyebrow: "—", heading: "The space", layout: "grid" },
      galleryImages: [
        { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80", alt: "Empty room" },
        { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", alt: "Daylight space" },
        { url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", alt: "Set tables" },
        { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80", alt: "Plated dinner" },
        { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80", alt: "Studio interior" },
        { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80", alt: "Workspace" },
      ],
      pricing: {
        eyebrow: "Rates",
        heading: "Two rates",
        subheading: "Per hour, or per day. That's it.",
        plans: [
          { name: "Hourly", price: "$XXX", priceNote: "/ hour", description: "Three-hour minimum.", features: ["Tables and chairs", "Sound", "Wi-Fi", "On-site host"], ctaLabel: "Inquire", highlighted: false },
          { name: "Daily", price: "$X,XXX", priceNote: "/ day", description: "Twelve hours, end to end.", features: ["Everything in Hourly", "Setup + breakdown crew", "Service kitchen access"], ctaLabel: "Inquire", highlighted: false },
        ],
      },
      testimonials: {
        eyebrow: "—",
        heading: "",
        layout: "single",
        items: [
          { quote: `Spare, well-lit, calm. ${p.venueName} got out of our way and let the dinner be the centerpiece.`, authorName: "Yuki Tanaka", authorTitle: "Hostess", eventType: "Private Dinner", rating: 5 },
        ],
      },
      contact: {
        eyebrow: "—",
        heading: "Contact",
        subheading: "",
        submitLabel: "Send",
        successMessage: "Received.",
      },
      cta: {
        eyebrow: "—",
        heading: "Visit",
        subheading: "By appointment.",
        primaryCtaLabel: "Schedule",
        backgroundUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=2000&q=80",
        overlayOpacity: 0.4,
      },
      ourVenue: {
        heroHeadline: "The room",
        heroSubheadline: "2,400 sq ft. North windows. East courtyard.",
        heroImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80",
        storyHeading: "Built for restraint",
        storyBody: `${p.venueName} is one room and an outdoor courtyard. White oak floors. Twelve-foot ceilings. Nothing on the walls. The lighting is dimmable. The sound is hidden. The room becomes whatever you decide it becomes.`,
        amenitiesHeading: "Inside",
      },
      galleryPage: {
        heroHeadline: "Documentation",
        heroSubheadline: "",
      },
      packagesPage: {
        heroHeadline: "Rates",
        heroSubheadline: "",
      },
      contactPage: {
        heroHeadline: "Contact",
        heroSubheadline: "",
      },
    };
  },

  classic: (p) => {
    const cap = p.capacity;
    const halfCap = Math.max(40, Math.floor(cap / 2));
    return {
      hero: {
        headline: "Where love stories begin",
        subheadline: `Some moments deserve a setting as timeless as the love behind them. ${p.venueName} — a romantic venue for weddings and the celebrations that follow.`,
        backgroundUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=80",
        overlayOpacity: 0.4,
        ctaLabel: "Begin Your Story",
        alignment: "center",
        height: "screen",
      },
      story: {
        eyebrow: "Our Story",
        heading: "A wedding venue with a heart",
        body: `${p.venueName} is a place for couples who believe their wedding day deserves more than a checklist. Garden ceremonies under a flowering arbor. Receptions in the candlelit ballroom. A bridal cottage for the morning of. Every space holds a memory waiting to be made.`,
      },
      features: {
        eyebrow: "Crafted With Love",
        heading: "Everything you'd dream of",
        items: [
          { icon: "♡", title: "Garden Ceremony Site", description: "Outdoor ceremonies under flowering arbors with a backup indoor plan." },
          { icon: "♡", title: "Reception Ballroom", description: `A candlelit ballroom for elegant receptions of up to ${cap} guests.` },
          { icon: "♡", title: "Bridal Cottage", description: "A private cottage for the morning of with vanity stations and natural light." },
          { icon: "♡", title: "Floral Partners", description: "A network of preferred florists who know the property's spaces by heart." },
          { icon: "♡", title: "Heritage Photography", description: "Three on-property locations chosen for golden-hour portraits." },
          { icon: "♡", title: "Wedding Coordinator", description: "Your dedicated coordinator from booking through your last dance." },
        ],
      },
      galleryHeading: { eyebrow: "Inspiration", heading: "Real weddings", layout: "masonry" },
      galleryImages: [
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", alt: "Garden ceremony" },
        { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80", alt: "Wedding florals" },
        { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80", alt: "First dance" },
        { url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80", alt: "Bouquet" },
        { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80", alt: "Aisle and arbor" },
        { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", alt: "Reception" },
      ],
      pricing: {
        eyebrow: "Wedding Packages",
        heading: "Two timeless packages",
        subheading: "Both packages include the ceremony site, reception ballroom, and bridal cottage.",
        plans: [
          { name: "Intimate Affair", price: "$X,XXX", priceNote: "Starting at", description: `An intimate wedding for up to ${halfCap} loved ones.`, features: ["6-hour event timeline", "Garden ceremony + ballroom reception", "Bridal cottage access (4 hours)", "Wedding coordinator", "Day-of styling consult"], ctaLabel: "Inquire", highlighted: false },
          { name: "Garden Wedding", price: "$XX,XXX", priceNote: "Starting at", description: `Our signature wedding for up to ${cap} guests.`, features: ["10-hour event timeline", "Full property buyout", "Bridal cottage access (full day)", "Lead coordinator + 2 assistants", "Floral consultation included", "Champagne welcome reception"], ctaLabel: "Inquire", highlighted: true },
        ],
      },
      testimonials: {
        eyebrow: "Their Words",
        heading: "From our couples",
        layout: "grid",
        items: [
          { quote: `Walking down the aisle at ${p.venueName} was every dream we ever had as little girls. The team made our wedding day feel sacred.`, authorName: "Emma & Sarah", authorTitle: "The Hartwell-Cole Wedding", eventType: "June Garden Wedding", rating: 5 },
          { quote: "Our parents kept saying it felt like a wedding from a different era — in the best possible way. Romance, attention to detail, beautiful florals throughout.", authorName: "Alessia & Marco", authorTitle: "The Romano Wedding", eventType: "September Wedding · 140 guests", rating: 5 },
          { quote: "From the bridal cottage to the candlelit ballroom, every moment felt curated for us. We didn't have to ask for anything.", authorName: "Naomi & David", authorTitle: "The Berg-Sato Wedding", eventType: "October Wedding · 95 guests", rating: 5 },
        ],
      },
      contact: {
        eyebrow: "Begin Your Story",
        heading: "Tell us about your wedding",
        subheading: "Share your dream date and a few details — our wedding coordinator will be in touch within one business day.",
        submitLabel: "Send Inquiry",
        successMessage: `Thank you. We've received your inquiry and can't wait to hear more about your wedding day. Our coordinator will be in touch soon.`,
      },
      cta: {
        eyebrow: "Visit Us",
        heading: "Schedule a venue walk-through",
        subheading: "Bring your partner. Walk the gardens. Picture your day with us.",
        primaryCtaLabel: "Schedule a Walk-Through",
        backgroundUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=2000&q=80",
        overlayOpacity: 0.5,
      },
      ourVenue: {
        heroHeadline: "Our gardens & ballroom",
        heroSubheadline: "Five acres of romance, room for every ritual.",
        heroImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=2000&q=80",
        storyHeading: "A property with history",
        storyBody: `${p.venueName} sits on five acres of historic gardens, with mature flowering trees, manicured lawns, and a restored ballroom that has hosted weddings for decades. We host one wedding per weekend so your day is the only event we're focused on.`,
        amenitiesHeading: "Spaces & amenities",
      },
      galleryPage: {
        heroHeadline: "Real weddings",
        heroSubheadline: "Stories from couples who said yes here.",
      },
      packagesPage: {
        heroHeadline: "Wedding Packages",
        heroSubheadline: "Two timeless ways to celebrate.",
      },
      contactPage: {
        heroHeadline: "Begin your story",
        heroSubheadline: "Tell us about your wedding day.",
      },
    };
  },

  corporate: (p) => {
    const cap = p.capacity;
    return {
      hero: {
        headline: "Host events that move your business forward",
        subheadline: `${p.venueName} is a turn-key venue for board meetings, product launches, conferences, and corporate galas. Capacity for up to ${cap} attendees.`,
        backgroundUrl:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=80",
        overlayOpacity: 0.5,
        ctaLabel: "Request a Quote",
        alignment: "left",
        height: "large",
      },
      story: {
        eyebrow: "About",
        heading: "A venue your team can rely on",
        body: `${p.venueName} is built for the events your business depends on — quarterly all-hands, customer summits, leadership offsites. Predictable spaces, professional staff, and the AV infrastructure to back them up. Half-day, full-day, and multi-day rates available.`,
      },
      features: {
        eyebrow: "Capabilities",
        heading: "Built for productivity",
        items: [
          { icon: "▸", title: "Enterprise Wi-Fi", description: "Dedicated 1 Gbps fiber, segmented network for hybrid attendees." },
          { icon: "▸", title: "AV Production Suite", description: "Dual 4K projection, line-array sound, professional lighting, three-camera streaming rig." },
          { icon: "▸", title: "Configurable Rooms", description: "Theater, classroom, banquet, or U-shape — six modular spaces." },
          { icon: "▸", title: "On-Site Catering Kitchen", description: "Continental breakfast, working lunches, and full plated dinners." },
          { icon: "▸", title: "Concierge Coordination", description: "A dedicated event manager from RFP to final invoice." },
          { icon: "▸", title: "Convenient Access", description: "Adjacent garage, shuttle pickup, and ADA-accessible throughout." },
        ],
      },
      galleryHeading: { eyebrow: "Spaces", heading: "Inside the venue", layout: "grid" },
      galleryImages: [
        { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80", alt: "Conference hall" },
        { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80", alt: "Boardroom" },
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", alt: "Breakout space" },
        { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80", alt: "Networking lounge" },
        { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80", alt: "Workshop room" },
        { url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80", alt: "Open lobby" },
      ],
      pricing: {
        eyebrow: "Engagement Models",
        heading: "Choose your engagement",
        subheading: "Half-day, full-day, or custom multi-day rates. Volume pricing for series engagements.",
        plans: [
          { name: "Half-Day", price: "$X,XXX", priceNote: "Per session", description: `Up to 4 hours, single-room buyout, ${Math.floor(cap / 4)}–${Math.floor(cap / 2)} attendees.`, features: ["Conference room or breakout", "AV operator on site", "Breakfast or lunch service", "Wi-Fi + parking included"], ctaLabel: "Request Quote", highlighted: false },
          { name: "Full-Day Engagement", price: "$XX,XXX", priceNote: "Per day", description: `Up to 9 hours, multi-room access, up to ${cap} attendees.`, features: ["Main hall + 2 breakouts", "AV production crew", "Catered breakfast, lunch, snacks", "Live-stream package available", "Dedicated event manager"], ctaLabel: "Request Quote", highlighted: true },
        ],
      },
      testimonials: {
        eyebrow: "Trusted By",
        heading: "What our clients say",
        layout: "grid",
        items: [
          { quote: `${p.venueName} hosts our quarterly leadership summit. The space, the AV, and the catering have been consistently flawless across eight events.`, authorName: "Lisa Park", authorTitle: "Chief of Staff", eventType: "Leadership Summit · 80 attendees", rating: 5 },
          { quote: "We chose this venue for our customer conference because of the AV infrastructure. We were not disappointed — zero technical issues across two days of programming.", authorName: "James Okafor", authorTitle: "VP of Marketing", eventType: "Customer Conference · 380 attendees", rating: 5 },
          { quote: "Predictable, professional, easy to book again. Our event manager handled every detail and stayed in scope.", authorName: "Hannah Becker", authorTitle: "Director of Events", eventType: "Annual Sales Kickoff · 220 attendees", rating: 5 },
        ],
      },
      contact: {
        eyebrow: "Get a Quote",
        heading: "Tell us about your event",
        subheading: "Submit your event brief and our event manager will respond within one business day with availability and pricing.",
        submitLabel: "Request Quote",
        successMessage: `Thank you. Our event manager will respond within one business day with availability, pricing, and a venue brochure.`,
      },
      cta: {
        eyebrow: "Visit",
        heading: "Tour our spaces",
        subheading: "Tours are available weekday mornings and afternoons. We'll walk you through every room.",
        primaryCtaLabel: "Schedule a Tour",
        backgroundUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80",
        overlayOpacity: 0.6,
      },
      ourVenue: {
        heroHeadline: "Our venue",
        heroSubheadline: "Six modular event spaces under one roof.",
        heroImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80",
        storyHeading: "A purpose-built corporate venue",
        storyBody: `${p.venueName} is a 24,000 square-foot corporate event facility. The main hall seats up to ${cap} for general sessions; six breakout rooms support workshops and side meetings. Everything is wired for AV and built for corporate workflows.`,
        amenitiesHeading: "Capabilities",
      },
      galleryPage: {
        heroHeadline: "Past events",
        heroSubheadline: "A look at recent corporate gatherings.",
      },
      packagesPage: {
        heroHeadline: "Pricing & engagement",
        heroSubheadline: "Half-day, full-day, multi-day. Volume rates available.",
      },
      contactPage: {
        heroHeadline: "Request a quote",
        heroSubheadline: "Tell us about your event and we'll respond within a business day.",
      },
    };
  },
};

// ----------------------- PAGE BUILDERS -----------------------

function homeBlocks(p: TemplateParams, c: ToneContent): TemplateBlock[] {
  return [
    {
      blockType: "HeroBlock",
      displayOrder: 0,
      blockData: {
        headline: c.hero.headline,
        subheadline: c.hero.subheadline,
        backgroundType: "image",
        backgroundUrl: c.hero.backgroundUrl,
        overlayOpacity: c.hero.overlayOpacity,
        ctaLabel: c.hero.ctaLabel,
        ctaHref: "#contact",
        alignment: c.hero.alignment,
        height: c.hero.height,
      },
    },
    {
      blockType: "TextSection",
      displayOrder: 1,
      blockData: {
        eyebrow: c.story.eyebrow,
        heading: c.story.heading,
        body: c.story.body,
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
        eyebrow: c.features.eyebrow,
        heading: c.features.heading,
        layout: "grid",
        columns: c.features.items.length === 4 ? 4 : 3,
        features: c.features.items,
      },
    },
    {
      blockType: "GallerySection",
      displayOrder: 3,
      blockData: {
        eyebrow: c.galleryHeading.eyebrow,
        heading: c.galleryHeading.heading,
        layout: c.galleryHeading.layout,
        columns: 3,
        gap: "normal",
        aspectRatio: "auto",
        images: c.galleryImages,
      },
    },
    {
      blockType: "PricingTable",
      displayOrder: 4,
      blockData: {
        eyebrow: c.pricing.eyebrow,
        heading: c.pricing.heading,
        subheading: c.pricing.subheading,
        plans: c.pricing.plans.map((plan) => ({ ...plan, ctaHref: "#contact" })),
      },
    },
    {
      blockType: "TestimonialSection",
      displayOrder: 5,
      blockData: {
        eyebrow: c.testimonials.eyebrow,
        heading: c.testimonials.heading,
        layout: c.testimonials.layout,
        testimonials: c.testimonials.items,
      },
    },
    {
      blockType: "ContactFormBlock",
      displayOrder: 6,
      blockData: {
        eyebrow: c.contact.eyebrow,
        heading: c.contact.heading,
        subheading: c.contact.subheading,
        submitLabel: c.contact.submitLabel,
        successMessage: c.contact.successMessage,
        background: "secondary",
      },
    },
    {
      blockType: "CTASection",
      displayOrder: 7,
      blockData: {
        eyebrow: c.cta.eyebrow,
        heading: c.cta.heading,
        subheading: c.cta.subheading,
        primaryCtaLabel: c.cta.primaryCtaLabel,
        primaryCtaHref: "#contact",
        backgroundType: "image",
        backgroundValue: c.cta.backgroundUrl,
        overlayOpacity: c.cta.overlayOpacity,
        alignment: "center",
      },
    },
  ];
}

function ourVenueBlocks(_p: TemplateParams, c: ToneContent): TemplateBlock[] {
  return [
    {
      blockType: "HeroBlock",
      displayOrder: 0,
      blockData: {
        headline: c.ourVenue.heroHeadline,
        subheadline: c.ourVenue.heroSubheadline,
        backgroundType: "image",
        backgroundUrl: c.ourVenue.heroImage,
        overlayOpacity: 0.45,
        ctaLabel: c.cta.primaryCtaLabel,
        ctaHref: "/v/__SLUG__/contact",
        alignment: "center",
        height: "large",
      },
    },
    {
      blockType: "TextSection",
      displayOrder: 1,
      blockData: {
        eyebrow: "The Space",
        heading: c.ourVenue.storyHeading,
        body: c.ourVenue.storyBody,
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
        eyebrow: c.features.eyebrow,
        heading: c.ourVenue.amenitiesHeading,
        layout: "grid",
        columns: c.features.items.length === 4 ? 4 : 3,
        features: c.features.items,
      },
    },
    {
      blockType: "GallerySection",
      displayOrder: 3,
      blockData: {
        layout: "grid",
        columns: 3,
        gap: "normal",
        aspectRatio: "landscape",
        images: c.galleryImages.slice(0, 6),
      },
    },
    {
      blockType: "CTASection",
      displayOrder: 4,
      blockData: {
        eyebrow: c.cta.eyebrow,
        heading: c.cta.heading,
        subheading: c.cta.subheading,
        primaryCtaLabel: c.cta.primaryCtaLabel,
        primaryCtaHref: "/v/__SLUG__/contact",
        backgroundType: "image",
        backgroundValue: c.cta.backgroundUrl,
        overlayOpacity: c.cta.overlayOpacity,
        alignment: "center",
      },
    },
  ];
}

function galleryPageBlocks(_p: TemplateParams, c: ToneContent): TemplateBlock[] {
  return [
    {
      blockType: "HeroBlock",
      displayOrder: 0,
      blockData: {
        headline: c.galleryPage.heroHeadline,
        subheadline: c.galleryPage.heroSubheadline,
        backgroundType: "image",
        backgroundUrl: c.galleryImages[0]?.url ?? c.hero.backgroundUrl,
        overlayOpacity: 0.4,
        alignment: "center",
        height: "medium",
      },
    },
    {
      blockType: "GallerySection",
      displayOrder: 1,
      blockData: {
        layout: c.galleryHeading.layout,
        columns: 3,
        gap: "normal",
        aspectRatio: "auto",
        images: c.galleryImages,
      },
    },
  ];
}

function packagesPageBlocks(_p: TemplateParams, c: ToneContent): TemplateBlock[] {
  return [
    {
      blockType: "HeroBlock",
      displayOrder: 0,
      blockData: {
        headline: c.packagesPage.heroHeadline,
        subheadline: c.packagesPage.heroSubheadline,
        backgroundType: "image",
        backgroundUrl: c.cta.backgroundUrl,
        overlayOpacity: 0.5,
        alignment: "center",
        height: "medium",
      },
    },
    {
      blockType: "PricingTable",
      displayOrder: 1,
      blockData: {
        eyebrow: c.pricing.eyebrow,
        heading: c.pricing.heading,
        subheading: c.pricing.subheading,
        plans: c.pricing.plans.map((plan) => ({ ...plan, ctaHref: "/v/__SLUG__/contact" })),
      },
    },
    {
      blockType: "ContactFormBlock",
      displayOrder: 2,
      blockData: {
        eyebrow: "Get a Quote",
        heading: "Tell us about your event",
        subheading: "Share a few details and we'll send personalized pricing within one business day.",
        submitLabel: "Request Quote",
        successMessage: c.contact.successMessage,
        background: "secondary",
      },
    },
  ];
}

function contactPageBlocks(_p: TemplateParams, c: ToneContent): TemplateBlock[] {
  return [
    {
      blockType: "HeroBlock",
      displayOrder: 0,
      blockData: {
        headline: c.contactPage.heroHeadline,
        subheadline: c.contactPage.heroSubheadline,
        backgroundType: "image",
        backgroundUrl: c.cta.backgroundUrl,
        overlayOpacity: 0.55,
        alignment: "center",
        height: "medium",
      },
    },
    {
      blockType: "ContactFormBlock",
      displayOrder: 1,
      blockData: {
        eyebrow: c.contact.eyebrow,
        heading: c.contact.heading,
        subheading: c.contact.subheading,
        submitLabel: c.contact.submitLabel,
        successMessage: c.contact.successMessage,
        background: "secondary",
      },
    },
  ];
}

export function buildSitePages(params: TemplateParams, tone: Tone = "luxury"): TemplatePage[] {
  const c = (TONE_CONTENT[tone] ?? TONE_CONTENT.luxury)(params);
  const titleSuffix = params.venueName;

  return [
    {
      slug: "home",
      title: "Home",
      metaTitle: titleSuffix,
      metaDescription: c.story.body.slice(0, 160),
      displayOrder: 0,
      blocks: homeBlocks(params, c),
    },
    {
      slug: "our-venue",
      title: "Our Venue",
      metaTitle: `Our Venue — ${titleSuffix}`,
      metaDescription: `Tour the spaces, amenities, and details that make ${titleSuffix} special.`,
      displayOrder: 1,
      blocks: ourVenueBlocks(params, c),
    },
    {
      slug: "gallery",
      title: "Gallery",
      metaTitle: `Gallery — ${titleSuffix}`,
      metaDescription: `A look at past events at ${titleSuffix}.`,
      displayOrder: 2,
      blocks: galleryPageBlocks(params, c),
    },
    {
      slug: "packages",
      title: "Packages & Pricing",
      metaTitle: `Packages — ${titleSuffix}`,
      metaDescription: `Pricing and packages for events at ${titleSuffix}.`,
      displayOrder: 3,
      blocks: packagesPageBlocks(params, c),
    },
    {
      slug: "contact",
      title: "Contact",
      metaTitle: `Contact ${titleSuffix}`,
      metaDescription: `Get in touch with ${titleSuffix}.`,
      displayOrder: 4,
      blocks: contactPageBlocks(params, c),
    },
  ];
}
