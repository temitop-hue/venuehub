import React from "react";
import { colors, fonts, section, container, h2, eyebrow, divider } from "../styles";

const STEPS = [
  {
    n: "01",
    title: "Sign up",
    body: "Create your account and pick a plan. 14-day free trial, no card.",
  },
  {
    n: "02",
    title: "Choose a style",
    body: "Pick one of five luxury templates. Your site is pre-built.",
  },
  {
    n: "03",
    title: "Customize",
    body: "Upload photos, set pricing, edit text. Live preview as you go.",
  },
  {
    n: "04",
    title: "Go live",
    body: "One click to publish. Your site is at yourslug.venuehub.app.",
  },
];

export function HowItWorks() {
  return (
    <section style={{ ...section(7), background: colors.bg }}>
      <div style={container(80)}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ ...eyebrow, marginLeft: "auto", marginRight: "auto" }}>How It Works</div>
          <h2 style={h2}>Live in under 10 minutes.</h2>
          <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
            gap: "2rem",
            position: "relative",
          }}
        >
          {STEPS.map((s) => (
            <div key={s.n}>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: "3rem",
                  fontWeight: 400,
                  color: colors.accent,
                  lineHeight: 1,
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: colors.text,
                  margin: 0,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: "0.9375rem",
                  color: colors.textMuted,
                  marginTop: "0.75rem",
                  lineHeight: 1.6,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
