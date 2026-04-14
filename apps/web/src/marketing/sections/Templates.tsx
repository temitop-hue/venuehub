import React from "react";
import { colors, fonts, section, container, h2, eyebrow, lead, divider } from "../styles";

const TEMPLATES = [
  {
    tone: "luxury",
    name: "Luxury",
    description: "Serif headings, dark + gold, photography-forward.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    live: "/v/demo",
  },
  {
    tone: "modern",
    name: "Modern",
    description: "Geometric, bold, editorial whitespace.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    live: null,
  },
  {
    tone: "minimal",
    name: "Minimal",
    description: "Grid-driven, near monochrome.",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
    live: null,
  },
  {
    tone: "classic",
    name: "Classic Wedding",
    description: "Blush & ivory, Garamond, romantic curves.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    live: null,
  },
  {
    tone: "corporate",
    name: "Corporate",
    description: "Sharp edges, info-dense, blue accent.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    live: null,
  },
];

export function Templates() {
  return (
    <section
      id="templates"
      style={{ ...section(7), background: colors.bgAlt, borderTop: `1px solid ${colors.border}` }}
    >
      <div style={container(80)}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>Templates</div>
          <h2 style={h2}>Start with a premium template.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
          <p style={{ ...lead, marginLeft: "auto", marginRight: "auto" }}>
            Pick a tone. Swap the photos. Go live. Every template is fully editable and
            built on the same block system.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))",
            gap: "1.5rem",
          }}
        >
          {TEMPLATES.map((t) => (
            <article
              key={t.tone}
              style={{
                borderRadius: "6px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                background: colors.bgElevated,
              }}
            >
              <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                <img
                  src={t.image}
                  alt={t.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: "1.375rem",
                      fontWeight: 400,
                      color: colors.text,
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </h3>
                  {t.live ? (
                    <a
                      href={t.live}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontFamily: fonts.body,
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em",
                        color: colors.accent,
                        textDecoration: "none",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Preview →
                    </a>
                  ) : (
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: "0.6875rem",
                        letterSpacing: "0.15em",
                        color: colors.textDim,
                        textTransform: "uppercase",
                      }}
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "0.875rem",
                    color: colors.textMuted,
                    marginTop: "0.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  {t.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
