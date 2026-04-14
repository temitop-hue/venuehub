import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OnboardingLayout } from "./OnboardingLayout";
import { colors, fonts, pillButton } from "../marketing/styles";

type Tone = "luxury" | "modern" | "minimal" | "classic" | "corporate";

const TONES: Array<{
  tone: Tone;
  name: string;
  description: string;
  image: string;
  swatches: [string, string, string];
  headingFontLabel: string;
}> = [
  {
    tone: "luxury",
    name: "Luxury",
    description: "Serif headings, dark + gold, photography-forward.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    swatches: ["#0d0d0d", "#f7f3ea", "#c9a86a"],
    headingFontLabel: "Playfair Display",
  },
  {
    tone: "modern",
    name: "Modern",
    description: "Geometric, bold, editorial whitespace.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    swatches: ["#111111", "#ffffff", "#3b82f6"],
    headingFontLabel: "Inter Tight",
  },
  {
    tone: "minimal",
    name: "Minimal",
    description: "Grid-driven, near monochrome.",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
    swatches: ["#000000", "#ffffff", "#111111"],
    headingFontLabel: "Inter",
  },
  {
    tone: "classic",
    name: "Classic Wedding",
    description: "Blush & ivory, Garamond, romantic curves.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    swatches: ["#3a2e2a", "#faf0e6", "#c48a8a"],
    headingFontLabel: "Cormorant Garamond",
  },
  {
    tone: "corporate",
    name: "Corporate",
    description: "Sharp edges, info-dense, blue accent.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    swatches: ["#0f172a", "#ffffff", "#0ea5e9"],
    headingFontLabel: "Inter",
  },
];

export function StyleStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedState = (location.state || {}) as {
    primaryEventType?: string;
    capacity?: number;
    city?: string;
    state?: string;
  };
  const [selected, setSelected] = useState<Tone>("luxury");

  return (
    <OnboardingLayout step={2}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: "0.75rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: colors.accent,
              marginBottom: "1rem",
            }}
          >
            Step 2 of 4
          </div>
          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 400,
              color: colors.text,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Pick your style.
          </h1>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: "1rem",
              color: colors.textMuted,
              marginTop: "1rem",
              lineHeight: 1.6,
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Every style is fully editable — you can change colors, fonts, and layout anytime.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))",
            gap: "1.5rem",
            marginTop: "3rem",
          }}
        >
          {TONES.map((t) => {
            const isSelected = selected === t.tone;
            return (
              <button
                key={t.tone}
                onClick={() => setSelected(t.tone)}
                style={{
                  textAlign: "left",
                  padding: 0,
                  border: isSelected
                    ? `2px solid ${colors.accent}`
                    : `1px solid ${colors.border}`,
                  background: isSelected ? "rgba(201,168,106,0.05)" : colors.bgElevated,
                  borderRadius: "6px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "translateY(-4px)" : "none",
                  boxShadow: isSelected ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
                }}
              >
                <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        background: colors.accent,
                        color: colors.bg,
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
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
                  <p
                    style={{
                      fontFamily: fonts.body,
                      fontSize: "0.875rem",
                      color: colors.textMuted,
                      marginTop: "0.5rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {t.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {t.swatches.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            width: "1rem",
                            height: "1rem",
                            borderRadius: "50%",
                            background: s,
                            border: `1px solid ${colors.border}`,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: "0.6875rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: colors.textDim,
                      }}
                    >
                      {t.headingFontLabel}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3rem" }}>
          <button
            onClick={() => navigate("/onboarding/basics")}
            style={{
              ...pillButton("ghost"),
              color: colors.textMuted,
            }}
          >
            ← Back
          </button>
          <button
            onClick={() =>
              navigate("/onboarding/building", { state: { tone: selected, ...passedState } })
            }
            style={pillButton("solid")}
          >
            Build My Site →
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
