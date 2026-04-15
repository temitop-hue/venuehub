import React from "react";
import { isKnownBlockType, parseBlockData } from "@venuehub/shared";
import { HeroBlock } from "./blocks/HeroBlock";
import { TextSection } from "./blocks/TextSection";
import { GallerySection } from "./blocks/GallerySection";
import { FeatureList } from "./blocks/FeatureList";
import { PricingTable } from "./blocks/PricingTable";
import { TestimonialSection } from "./blocks/TestimonialSection";
import { CTASection } from "./blocks/CTASection";
import { ContactFormBlock } from "./blocks/ContactFormBlock";
import { FAQBlock } from "./blocks/FAQBlock";
import { TourBookingBlock } from "./blocks/TourBookingBlock";
import { AvailabilityBlock } from "./blocks/AvailabilityBlock";

export function BlockRenderer({
  type,
  data,
}: {
  type: string;
  data: unknown;
}) {
  if (!isKnownBlockType(type)) {
    if (import.meta.env.DEV) {
      console.warn(`[BlockRenderer] Unknown block type: ${type}`);
    }
    return null;
  }

  try {
    switch (type) {
      case "HeroBlock":
        return <HeroBlock {...parseBlockData("HeroBlock", data)} />;
      case "TextSection":
        return <TextSection {...parseBlockData("TextSection", data)} />;
      case "GallerySection":
        return <GallerySection {...parseBlockData("GallerySection", data)} />;
      case "FeatureList":
        return <FeatureList {...parseBlockData("FeatureList", data)} />;
      case "PricingTable":
        return <PricingTable {...parseBlockData("PricingTable", data)} />;
      case "TestimonialSection":
        return <TestimonialSection {...parseBlockData("TestimonialSection", data)} />;
      case "CTASection":
        return <CTASection {...parseBlockData("CTASection", data)} />;
      case "ContactFormBlock":
        return <ContactFormBlock {...parseBlockData("ContactFormBlock", data)} />;
      case "FAQBlock":
        return <FAQBlock {...parseBlockData("FAQBlock", data)} />;
      case "TourBookingBlock":
        return <TourBookingBlock {...parseBlockData("TourBookingBlock", data)} />;
      case "AvailabilityBlock":
        return <AvailabilityBlock {...parseBlockData("AvailabilityBlock", data)} />;
      default: {
        const _exhaustive: never = type;
        return _exhaustive;
      }
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`[BlockRenderer] Failed to render ${type}`, err);
    }
    return null;
  }
}
