import React from "react";
import { colors, fonts, pillButton } from "../styles";

export function FinalCTA() {
  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem)",
        background: `radial-gradient(ellipse at center, rgba(201,168,106,0.15), transparent 60%), ${colors.bgAlt}`,
        borderTop: `1px solid ${colors.border}`,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: colors.text,
            margin: 0,
          }}
        >
          Your venue deserves better
          <br />
          <span style={{ color: colors.accent, fontStyle: "italic" }}>than spreadsheets.</span>
        </h2>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: "1.125rem",
            lineHeight: 1.7,
            color: colors.textMuted,
            marginTop: "1.75rem",
          }}
        >
          Launch a luxury site, streamline your bookings, and get paid on time.
          Start free — we'll be here when you're ready to go live.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          <a href="/login" style={pillButton("solid")}>
            Start Your Free Trial
          </a>
          <a href="/v/demo" target="_blank" style={pillButton("outline")}>
            See Live Demo →
          </a>
        </div>
      </div>
    </section>
  );
}
