import React from "react";
import { colors, fonts, section, container, h2, eyebrow, divider } from "../styles";

const QUOTES = [
  {
    quote: "This replaced five tools for us. Website, CRM, contracts, payments — all in one bill.",
    author: "Jordan K.",
    role: "Owner, Oakwood Estate",
  },
  {
    quote: "We launched the site in an afternoon and had our first booking inquiry that night. The templates are that good.",
    author: "Lena P.",
    role: "Director, Silverstream Manor",
  },
  {
    quote: "The booking wizard plus Stripe Connect means I never chase payments anymore. Revenue is automatic.",
    author: "Marcus R.",
    role: "Owner, The Ivory Room",
  },
];

export function Testimonials() {
  return (
    <section style={{ ...section(7), background: colors.bg }}>
      <div style={container(72)}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>Early Customers</div>
          <h2 style={h2}>What venue owners say.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))",
            gap: "1.5rem",
          }}
        >
          {QUOTES.map((q) => (
            <figure
              key={q.author}
              style={{
                margin: 0,
                padding: "2rem",
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
              }}
            >
              <div style={{ color: colors.accent, fontSize: "1.25rem", letterSpacing: "0.15em", marginBottom: "1rem" }}>
                ★★★★★
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: fonts.heading,
                  fontSize: "1.125rem",
                  lineHeight: 1.55,
                  color: colors.text,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                "{q.quote}"
              </blockquote>
              <figcaption
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  {q.author}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "0.75rem",
                    color: colors.textMuted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "0.25rem",
                  }}
                >
                  {q.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
