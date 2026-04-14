import React, { useState } from "react";
import { colors, fonts, section, container, h2, eyebrow, lead, divider } from "../styles";

const VIEWS = [
  {
    id: "site",
    label: "Luxury Website",
    tagline: "A site like this, built in minutes.",
    description:
      "Drag-and-drop block builder, premium templates, and instant publish. No code — ever.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: "crm",
    label: "CRM & Leads",
    tagline: "Every inquiry, scored and funneled.",
    description:
      "Lead scoring, pipeline stages, and automated follow-ups (Day 1, 3, 7). Nothing falls through.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: "booking",
    label: "Booking Flow",
    tagline: "Clients book and pay in six steps.",
    description:
      "Calendar check, package selection, add-ons, e-signature, and deposit — all in one flow.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
  },
];

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const view = VIEWS[active];

  return (
    <section style={{ ...section(7), background: colors.bgAlt, borderTop: `1px solid ${colors.border}` }}>
      <div style={container(80)}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>The Platform</div>
          <h2 style={h2}>One product. Three surfaces.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
          <p style={{ ...lead, marginLeft: "auto", marginRight: "auto" }}>
            Your public site, your CRM, and your booking flow — designed together, so they actually work together.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActive(i)}
              style={{
                padding: "0.75rem 1.5rem",
                background: i === active ? colors.accent : "transparent",
                color: i === active ? colors.bg : colors.textMuted,
                border:
                  i === active ? "none" : `1px solid ${colors.border}`,
                borderRadius: "3px",
                fontFamily: fonts.body,
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: fonts.heading,
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 400,
                color: colors.text,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {view.tagline}
            </h3>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: "1rem",
                lineHeight: 1.7,
                color: colors.textMuted,
                marginTop: "1rem",
              }}
            >
              {view.description}
            </p>
          </div>
          <div
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={view.image}
              alt={view.label}
              style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
