import React from "react";
import type { HeroBlockData } from "@venuehub/shared";

export function HeroBlock(props: HeroBlockData) {
  const {
    headline,
    subheadline,
    backgroundType,
    backgroundUrl,
    overlayOpacity,
    ctaLabel,
    ctaHref,
    alignment,
    height,
  } = props;

  const heightValue = height === "screen" ? "100vh" : height === "large" ? "80vh" : "60vh";

  const alignItems =
    alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: heightValue,
        overflow: "hidden",
        color: "white",
        background: "#111",
      }}
    >
      {backgroundType === "image" ? (
        <img
          src={backgroundUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <video
          src={backgroundUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity * 0.7}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity * 1.1}) 100%)`,
        }}
      />

      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems,
          textAlign: alignment,
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {headline}
        </h1>

        {subheadline && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
              marginTop: "1.5rem",
              maxWidth: "38rem",
              opacity: 0.92,
              lineHeight: 1.6,
              letterSpacing: "0.01em",
              marginLeft: alignment === "center" ? "auto" : 0,
              marginRight: alignment === "center" ? "auto" : 0,
            }}
          >
            {subheadline}
          </p>
        )}

        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            style={{
              display: "inline-block",
              marginTop: "2.5rem",
              padding: "1rem 2.75rem",
              background: "var(--color-accent)",
              color: "var(--color-primary)",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: "var(--radius)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            {ctaLabel}
          </a>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "3rem",
          background: "rgba(255,255,255,0.4)",
          animation: "venuehub-scroll-hint 2s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes venuehub-scroll-hint { 0%, 100% { opacity: 0.2; transform: translate(-50%, 0); } 50% { opacity: 0.8; transform: translate(-50%, 0.5rem); } }`}</style>
    </section>
  );
}
