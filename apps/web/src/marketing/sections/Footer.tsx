import React from "react";
import { colors, fonts } from "../styles";

export function Footer() {
  return (
    <footer
      style={{
        background: colors.bg,
        padding: "3rem clamp(1.5rem, 5vw, 4rem) 2rem",
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: "1.25rem",
              color: colors.text,
              letterSpacing: "-0.02em",
            }}
          >
            VenueHub
          </div>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: "0.8125rem",
              color: colors.textDim,
              margin: "0.5rem 0 0",
            }}
          >
            © {new Date().getFullYear()} VenueHub. Luxury venue-in-a-box.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontFamily: fonts.body,
            fontSize: "0.8125rem",
            color: colors.textMuted,
          }}
        >
          <a href="/v/demo" target="_blank" style={{ color: "inherit", textDecoration: "none" }}>
            Live Demo
          </a>
          <a href="/login" style={{ color: "inherit", textDecoration: "none" }}>
            Login
          </a>
          <a href="mailto:hello@venuehub.app" style={{ color: "inherit", textDecoration: "none" }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
