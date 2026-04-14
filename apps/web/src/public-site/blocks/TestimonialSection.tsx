import React from "react";
import type { TestimonialSectionData } from "@venuehub/shared";
import { section, container, eyebrow, heading, subheading, divider } from "../primitives";

export function TestimonialSection(props: TestimonialSectionData) {
  const { testimonials, layout, eyebrow: ey, heading: h, subheading: sh } = props;

  const single = layout === "single" || testimonials.length === 1;

  return (
    <section style={{ background: "var(--color-primary)", color: "var(--color-secondary)", ...section("xl") }}>
      <div style={container("wide")}>
        {(ey || h || sh) && (
          <header style={{ textAlign: "center", marginBottom: "4rem" }}>
            {ey && <div style={eyebrow}>{ey}</div>}
            {h && (
              <h2 style={{ ...heading, color: "var(--color-secondary)" }}>
                {h}
              </h2>
            )}
            {h && <div style={divider} />}
            {sh && (
              <p style={{ ...subheading, color: "var(--color-secondary)", opacity: 0.7, marginLeft: "auto", marginRight: "auto" }}>
                {sh}
              </p>
            )}
          </header>
        )}

        <div
          style={
            single
              ? { maxWidth: "48rem", margin: "0 auto", textAlign: "center" }
              : {
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fit, minmax(20rem, 1fr))`,
                  gap: "2rem",
                }
          }
        >
          {testimonials.map((t, i) => (
            <figure
              key={i}
              style={{
                margin: 0,
                padding: single ? "0" : "2.5rem",
                background: single ? "transparent" : "rgba(255,255,255,0.04)",
                borderRadius: single ? 0 : "var(--radius)",
                border: single ? "none" : "1px solid rgba(255,255,255,0.08)",
                textAlign: single ? "center" : "left",
              }}
            >
              {t.rating && (
                <div style={{ color: "var(--color-accent)", letterSpacing: "0.2em", marginBottom: "1rem", fontSize: "0.875rem" }}>
                  {"★".repeat(t.rating)}
                  <span style={{ opacity: 0.3 }}>{"★".repeat(5 - t.rating)}</span>
                </div>
              )}
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading)",
                  fontSize: single ? "clamp(1.5rem, 3vw, 2rem)" : "1.125rem",
                  lineHeight: 1.5,
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.005em",
                }}
              >
                {single && <span style={{ color: "var(--color-accent)", fontSize: "3rem", lineHeight: 0, verticalAlign: "-0.3em", marginRight: "0.25em" }}>"</span>}
                {t.quote}
                {single && <span style={{ color: "var(--color-accent)", fontSize: "3rem", lineHeight: 0, verticalAlign: "-0.3em", marginLeft: "0.25em" }}>"</span>}
              </blockquote>
              <figcaption
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: single ? "center" : "flex-start",
                }}
              >
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    alt=""
                    style={{ width: "3rem", height: "3rem", borderRadius: "50%", objectFit: "cover" }}
                  />
                )}
                <div style={{ textAlign: single ? "center" : "left" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                    {t.authorName}
                  </div>
                  {(t.authorTitle || t.eventType) && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        opacity: 0.6,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        marginTop: "0.25rem",
                      }}
                    >
                      {[t.authorTitle, t.eventType].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
