import React from "react";
import type { TextSectionData } from "@venuehub/shared";
import { section, container, eyebrow, heading, bodyText, divider } from "../primitives";

const BG: Record<TextSectionData["background"], string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  transparent: "transparent",
};

export function TextSection(props: TextSectionData) {
  const isDarkBg = props.background === "primary";
  const textColor = isDarkBg ? "var(--color-secondary)" : "var(--color-primary)";

  return (
    <section style={{ background: BG[props.background], ...section(props.paddingY) }}>
      <div style={{ ...container(props.maxWidth), textAlign: props.alignment, color: textColor }}>
        {props.eyebrow && (
          <div style={{ ...eyebrow, color: isDarkBg ? "var(--color-accent)" : "var(--color-accent)" }}>
            {props.eyebrow}
          </div>
        )}
        {props.heading && <h2 style={{ ...heading, color: textColor }}>{props.heading}</h2>}
        {props.heading && props.alignment === "center" && <div style={divider} />}
        <div
          style={{
            ...bodyText,
            color: textColor,
            marginTop: props.heading ? "1.5rem" : 0,
            whiteSpace: "pre-wrap",
            opacity: isDarkBg ? 0.8 : 0.85,
            marginLeft: props.alignment === "center" ? "auto" : 0,
            marginRight: props.alignment === "center" ? "auto" : 0,
            maxWidth: "44rem",
          }}
        >
          {props.body}
        </div>
      </div>
    </section>
  );
}
