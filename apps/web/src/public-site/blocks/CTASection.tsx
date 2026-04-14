import React from "react";
import type { CtaSectionData } from "@venuehub/shared";
import { eyebrow, pillButton } from "../primitives";

export function CTASection(props: CtaSectionData) {
  const isImage = props.backgroundType === "image" && props.backgroundValue;
  const isColor = props.backgroundType === "color";

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
        background: isColor
          ? (props.backgroundValue || "var(--color-primary)")
          : "var(--color-primary)",
        color: "var(--color-secondary)",
        overflow: "hidden",
      }}
    >
      {isImage && (
        <>
          <img
            src={props.backgroundValue}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `rgba(0,0,0,${props.overlayOpacity})`,
            }}
          />
        </>
      )}

      <div
        style={{
          position: "relative",
          maxWidth: "48rem",
          margin: "0 auto",
          textAlign: props.alignment,
        }}
      >
        {props.eyebrow && <div style={{ ...eyebrow, color: "var(--color-accent)" }}>{props.eyebrow}</div>}
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {props.heading}
        </h2>
        {props.subheading && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
              lineHeight: 1.7,
              marginTop: "1.25rem",
              opacity: 0.8,
              marginLeft: props.alignment === "center" ? "auto" : 0,
              marginRight: props.alignment === "center" ? "auto" : 0,
              maxWidth: "36rem",
            }}
          >
            {props.subheading}
          </p>
        )}

        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: props.alignment === "center" ? "center" : "flex-start",
          }}
        >
          <a href={props.primaryCtaHref} style={pillButton("solid")}>
            {props.primaryCtaLabel}
          </a>
          {props.secondaryCtaLabel && props.secondaryCtaHref && (
            <a
              href={props.secondaryCtaHref}
              style={{
                ...pillButton("outline"),
                color: "var(--color-secondary)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              {props.secondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
