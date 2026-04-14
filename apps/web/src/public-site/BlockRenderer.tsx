import React from "react";
import { isKnownBlockType, parseBlockData } from "@venuehub/shared";
import { HeroBlock } from "./blocks/HeroBlock";

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
