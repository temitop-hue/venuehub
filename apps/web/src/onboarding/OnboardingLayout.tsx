import React from "react";
import { colors, fonts } from "../marketing/styles";

const STEPS = ["Basics", "Style", "Building", "Preview"];

export function OnboardingLayout({
  step,
  children,
}: {
  step: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text }}>
      <header
        style={{
          padding: "1.5rem clamp(1.5rem, 5vw, 4rem)",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: fonts.heading,
            fontSize: "1.5rem",
            color: colors.text,
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          VenueHub
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {STEPS.map((label, i) => {
            const isActive = i + 1 === step;
            const isDone = i + 1 < step;
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: fonts.body,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isActive ? colors.text : isDone ? colors.accent : colors.textDim,
                }}
              >
                <span
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    background: isActive
                      ? colors.accent
                      : isDone
                        ? "rgba(201,168,106,0.15)"
                        : "transparent",
                    color: isActive ? colors.bg : isDone ? colors.accent : colors.textDim,
                    border: isActive || isDone ? "none" : `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span style={{ display: "var(--hide-on-mobile, inline)" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </header>
      <main style={{ padding: "clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)" }}>{children}</main>
    </div>
  );
}
