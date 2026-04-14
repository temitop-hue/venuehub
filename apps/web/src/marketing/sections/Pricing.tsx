import React from "react";
import { colors, fonts, section, container, h2, eyebrow, lead, divider, pillButton } from "../styles";

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    priceNote: "per month",
    description: "For new venues getting their first bookings online.",
    features: [
      "Luxury website + one template",
      "Online booking wizard",
      "Basic CRM",
      "Up to 20 events / year",
      "Email support",
    ],
    highlighted: false,
    ctaLabel: "Start Free Trial",
  },
  {
    name: "Growth",
    price: "$99",
    priceNote: "per month",
    description: "For established venues ready to scale bookings.",
    features: [
      "Everything in Starter",
      "Stripe Connect payments & deposits",
      "E-signed contracts & agreements",
      "Full CRM + lead scoring",
      "RSVP + QR check-in",
      "Up to 100 events / year",
      "Priority support",
    ],
    highlighted: true,
    ctaLabel: "Start Free Trial",
  },
  {
    name: "Pro",
    price: "$199",
    priceNote: "per month",
    description: "For multi-location groups and venue networks.",
    features: [
      "Everything in Growth",
      "Multi-location / multi-venue",
      "White-label (your domain)",
      "Accounting & payroll",
      "API access",
      "Unlimited events",
      "Dedicated account manager",
    ],
    highlighted: false,
    ctaLabel: "Start Free Trial",
  },
];

export function Pricing() {
  return (
    <section id="pricing" style={{ ...section(7), background: colors.bgAlt, borderTop: `1px solid ${colors.border}` }}>
      <div style={container(80)}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>Pricing</div>
          <h2 style={h2}>Simple pricing. Cancel anytime.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
          <p style={{ ...lead, marginLeft: "auto", marginRight: "auto" }}>
            14-day free trial on every plan. No credit card required to start.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))",
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {PLANS.map((p) => (
            <div
              key={p.name}
              style={{
                padding: "2.5rem",
                background: p.highlighted ? "rgba(201,168,106,0.05)" : colors.bgElevated,
                border: p.highlighted
                  ? `1px solid rgba(201,168,106,0.4)`
                  : `1px solid ${colors.border}`,
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transform: p.highlighted ? "translateY(-8px)" : "none",
                boxShadow: p.highlighted ? "0 30px 60px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {p.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: "-0.75rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: colors.accent,
                    color: colors.bg,
                    padding: "0.375rem 1rem",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    borderRadius: "3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontSize: "1.875rem",
                  fontWeight: 400,
                  color: colors.text,
                  margin: 0,
                }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: "0.875rem",
                  color: colors.textMuted,
                  marginTop: "0.5rem",
                  minHeight: "2.75rem",
                }}
              >
                {p.description}
              </p>

              <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
                <span
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: "3rem",
                    fontWeight: 400,
                    color: p.highlighted ? colors.accent : colors.text,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.price}
                </span>
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: "0.875rem",
                    color: colors.textMuted,
                    marginLeft: "0.5rem",
                  }}
                >
                  {p.priceNote}
                </span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                {p.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.9375rem",
                      padding: "0.5rem 0",
                      color: colors.text,
                      borderBottom: `1px solid ${colors.border}`,
                      display: "flex",
                      alignItems: "start",
                      gap: "0.625rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: colors.accent, flexShrink: 0, marginTop: "2px" }}>✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/login"
                style={{
                  ...pillButton(p.highlighted ? "solid" : "outline"),
                  marginTop: "2rem",
                  alignSelf: "stretch",
                }}
              >
                {p.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
