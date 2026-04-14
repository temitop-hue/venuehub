import React from "react";
import { colors, fonts, section } from "../styles";

const MARKS = [
  "Maison Lumière",
  "The Greenbrier Hall",
  "Oakwood Estate",
  "Laurel Gardens",
  "Silverstream Manor",
  "The Ivory Room",
];

export function TrustBar() {
  return (
    <section
      style={{
        ...section(4),
        background: colors.bgAlt,
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <p
          style={{
            textAlign: "center",
            fontFamily: fonts.body,
            fontSize: "0.75rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: colors.textDim,
            marginBottom: "2rem",
          }}
        >
          Built for modern event venues
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
            gap: "2rem",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {MARKS.map((name) => (
            <div
              key={name}
              style={{
                fontFamily: fonts.heading,
                fontSize: "1.125rem",
                color: colors.textMuted,
                letterSpacing: "0.02em",
                opacity: 0.7,
                textAlign: "center",
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
