import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { trpc } from "../trpc";
import { OnboardingLayout } from "./OnboardingLayout";
import { colors, fonts } from "../marketing/styles";

type Tone = "luxury" | "modern" | "minimal" | "classic" | "corporate";

const STAGES = [
  "Creating your site structure…",
  "Applying your theme…",
  "Placing your content blocks…",
  "Publishing to venuehub.app…",
];

export function BuildingStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const passed = (location.state || {}) as {
    tone?: Tone;
    primaryEventType?: string;
    capacity?: number;
    city?: string;
    state?: string;
  };
  const firedRef = useRef(false);

  const [stage, setStage] = useState(0);
  const applyMutation = trpc.onboarding.applyTemplate.useMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (!passed.tone) {
      navigate("/onboarding/basics");
      return;
    }
    applyMutation.mutate(
      {
        tone: passed.tone,
        primaryEventType: passed.primaryEventType || "Weddings",
        capacity: passed.capacity || 200,
        city: passed.city || "",
        state: passed.state || "",
      },
      {
        onSuccess: (res) => {
          setTimeout(() => {
            navigate("/onboarding/preview", { state: { tenantSlug: res.tenantSlug } });
          }, 600);
        },
      },
    );
  }, [passed, applyMutation, navigate]);

  const failed = applyMutation.isError;

  return (
    <OnboardingLayout step={3}>
      <div
        style={{
          maxWidth: "36rem",
          margin: "0 auto",
          textAlign: "center",
          padding: "4rem 0",
        }}
      >
        {!failed && (
          <div
            style={{
              width: "4rem",
              height: "4rem",
              margin: "0 auto 2rem",
              border: `2px solid ${colors.border}`,
              borderTopColor: colors.accent,
              borderRadius: "50%",
              animation: "vh-spin 0.9s linear infinite",
            }}
          />
        )}

        <h1
          style={{
            fontFamily: fonts.heading,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 400,
            color: colors.text,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {failed ? "Something went wrong." : "Building your venue site…"}
        </h1>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: "1rem",
            color: colors.textMuted,
            marginTop: "1rem",
            lineHeight: 1.6,
          }}
        >
          {failed
            ? applyMutation.error?.message ?? "Please try again."
            : STAGES[stage]}
        </p>

        {!failed && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "3rem",
              maxWidth: "20rem",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
            }}
          >
            {STAGES.map((s, i) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontFamily: fonts.body,
                  fontSize: "0.875rem",
                  color: i <= stage ? colors.text : colors.textDim,
                  opacity: i <= stage ? 1 : 0.5,
                  transition: "opacity 0.3s ease, color 0.3s ease",
                }}
              >
                <span
                  style={{
                    color: i < stage ? colors.accent : i === stage ? colors.text : colors.textDim,
                  }}
                >
                  {i < stage ? "✓" : i === stage ? "→" : "·"}
                </span>
                {s}
              </div>
            ))}
          </div>
        )}

        {failed && (
          <button
            onClick={() => navigate("/onboarding/style")}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              color: colors.text,
              fontFamily: fonts.body,
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Back to style
          </button>
        )}

        <style>{`@keyframes vh-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </OnboardingLayout>
  );
}
