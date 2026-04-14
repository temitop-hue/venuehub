import React from "react";
import { colors, fonts, section, container, h2, eyebrow, lead, divider } from "../styles";

export function ProblemSolution() {
  return (
    <section style={{ ...section(7), background: colors.bg }}>
      <div style={container(72)}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>The Problem</div>
          <h2 style={h2}>Your ops shouldn't live in five tabs.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
          <p style={{ ...lead, marginLeft: "auto", marginRight: "auto" }}>
            Most venues juggle a website builder, a booking form, a spreadsheet for leads,
            a separate payment tool, and a dozen email threads. You lose deals in the seams.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(22rem, 100%), 1fr))",
            gap: "1.5rem",
            marginTop: "3rem",
          }}
        >
          <div
            style={{
              padding: "2.5rem",
              background: colors.bgElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                ...eyebrow,
                color: "#8a6a6a",
                marginBottom: "1.5rem",
              }}
            >
              The Old Way
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[
                "Website on Squarespace",
                "Booking form on Google Forms",
                "Leads in a spreadsheet",
                "Payments through Venmo + invoices",
                "Contracts over email",
                "Reminders set manually",
              ].map((line) => (
                <li
                  key={line}
                  style={{
                    padding: "0.625rem 0",
                    fontFamily: fonts.body,
                    fontSize: "0.9375rem",
                    color: colors.textMuted,
                    borderBottom: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ color: "#6a5050" }}>✗</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: "2.5rem",
              background: "linear-gradient(135deg, rgba(201,168,106,0.08), rgba(201,168,106,0.02))",
              border: `1px solid rgba(201,168,106,0.35)`,
              borderRadius: "6px",
              position: "relative",
            }}
          >
            <div style={{ ...eyebrow, color: colors.accent, marginBottom: "1.5rem" }}>
              With VenueHub
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[
                "Luxury website with your branding",
                "Online booking wizard with live calendar",
                "CRM with lead scoring & funnel",
                "Stripe payments & milestone plans",
                "E-signed contracts & agreements",
                "Automated reminders & follow-ups",
              ].map((line) => (
                <li
                  key={line}
                  style={{
                    padding: "0.625rem 0",
                    fontFamily: fonts.body,
                    fontSize: "0.9375rem",
                    color: colors.text,
                    borderBottom: `1px solid rgba(201,168,106,0.15)`,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ color: colors.accent }}>✦</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
