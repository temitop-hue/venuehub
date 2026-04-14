import React from "react";
import { colors, fonts, section, container, h2, eyebrow, lead, divider } from "../styles";

const FEATURES = [
  {
    icon: "💰",
    title: "Get Booked Faster",
    bullets: [
      "Beautiful booking pages",
      "Real-time availability calendar",
      "Tour scheduling built in",
    ],
  },
  {
    icon: "💳",
    title: "Get Paid Seamlessly",
    bullets: [
      "Deposits & multi-milestone payment plans",
      "Stripe Connect — funds direct to you",
      "Auto reminders & overdue handling",
    ],
  },
  {
    icon: "📅",
    title: "Manage Everything",
    bullets: [
      "CRM with lead scoring & pipeline",
      "Event tracking & day-of timelines",
      "Accounting & payroll included",
    ],
  },
  {
    icon: "🎨",
    title: "Look Premium Instantly",
    bullets: [
      "Five luxury templates",
      "Full branding control (color, type, logo)",
      "Block-based page builder",
    ],
  },
  {
    icon: "📲",
    title: "Impress Your Clients",
    bullets: [
      "RSVP pages for every event",
      "QR code check-in for guests",
      "Client portal with signed contracts",
    ],
  },
];

export function Features() {
  return (
    <section id="features" style={{ ...section(7), background: colors.bg }}>
      <div style={container(80)}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>What You Get</div>
          <h2 style={h2}>Everything a luxury venue needs.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
          <p style={{ ...lead, marginLeft: "auto", marginRight: "auto" }}>
            Five outcomes, one subscription. No add-ons, no integrations, no duct tape.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "2rem",
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: colors.text,
                  margin: 0,
                }}
              >
                {f.title}
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "1.25rem 0 0",
                }}
              >
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.9375rem",
                      color: colors.textMuted,
                      padding: "0.375rem 0",
                      display: "flex",
                      gap: "0.625rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: colors.accent, flexShrink: 0 }}>✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
