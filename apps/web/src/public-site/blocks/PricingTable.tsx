import React from "react";
import type { PricingTableData } from "@venuehub/shared";
import { section, container, eyebrow, heading, subheading, divider, pillButton } from "../primitives";

export function PricingTable(props: PricingTableData) {
  const { plans, eyebrow: ey, heading: h, subheading: sh } = props;

  return (
    <section style={{ background: "var(--color-secondary)", ...section("xl") }}>
      <div style={container("wide")}>
        {(ey || h || sh) && (
          <header style={{ textAlign: "center", marginBottom: "4rem" }}>
            {ey && <div style={eyebrow}>{ey}</div>}
            {h && <h2 style={heading}>{h}</h2>}
            {h && <div style={divider} />}
            {sh && <p style={{ ...subheading, marginLeft: "auto", marginRight: "auto" }}>{sh}</p>}
          </header>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(18rem, 1fr))`,
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: plan.highlighted ? "var(--color-primary)" : "white",
                color: plan.highlighted ? "var(--color-secondary)" : "var(--color-primary)",
                padding: "3rem 2.25rem",
                borderRadius: "var(--radius)",
                border: plan.highlighted ? "none" : "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.highlighted ? "0 20px 60px rgba(0,0,0,0.18)" : "none",
                transform: plan.highlighted ? "translateY(-8px)" : "none",
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: "-0.75rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--color-accent)",
                    color: "var(--color-primary)",
                    padding: "0.375rem 1rem",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    borderRadius: "var(--radius)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}

              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 400,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {plan.name}
              </h3>

              {plan.description && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    marginTop: "0.5rem",
                    opacity: 0.7,
                  }}
                >
                  {plan.description}
                </p>
              )}

              <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
                {plan.priceNote && (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      opacity: 0.65,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {plan.priceNote}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "3rem",
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: plan.highlighted ? "var(--color-accent)" : "var(--color-primary)",
                  }}
                >
                  {plan.price}
                </div>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                {plan.features.map((f, fi) => (
                  <li
                    key={fi}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      padding: "0.625rem 0",
                      borderBottom: plan.highlighted
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(0,0,0,0.06)",
                      display: "flex",
                      alignItems: "start",
                      gap: "0.75rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }}>✦</span>
                    <span style={{ opacity: 0.85 }}>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaLabel && plan.ctaHref && (
                <a
                  href={plan.ctaHref}
                  style={{
                    ...pillButton(plan.highlighted ? "solid" : "outline"),
                    marginTop: "2rem",
                    alignSelf: "stretch",
                  }}
                >
                  {plan.ctaLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
