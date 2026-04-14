import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { trpc } from "../trpc";
import { OnboardingLayout } from "./OnboardingLayout";
import { colors, fonts, pillButton } from "../marketing/styles";

export function PreviewStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const statusQuery = trpc.onboarding.status.useQuery();
  const completeMutation = trpc.onboarding.complete.useMutation({
    onSuccess: () => navigate("/dashboard"),
  });

  const passed = (location.state || {}) as { tenantSlug?: string };
  const tenantSlug = passed.tenantSlug ?? statusQuery.data?.slug;
  const previewUrl = tenantSlug ? `/v/${tenantSlug}` : null;

  return (
    <OnboardingLayout step={4}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
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
            Your site is live.
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
            Meet your new venue site.
          </h1>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: "1rem",
              color: colors.textMuted,
              marginTop: "1rem",
              lineHeight: 1.6,
              maxWidth: "38rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            This is a starting point — swap photos, edit copy, and set pricing from the dashboard.
          </p>
          {tenantSlug && (
            <div
              style={{
                marginTop: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                borderRadius: "4px",
                fontFamily: fonts.body,
                fontSize: "0.8125rem",
                color: colors.textMuted,
              }}
            >
              <span style={{ color: colors.accent }}>●</span>
              venuehub.app/v/{tenantSlug}
            </div>
          )}
        </div>

        {previewUrl && (
          <div
            style={{
              marginTop: "3rem",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              background: colors.bgElevated,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderBottom: `1px solid ${colors.border}`,
                background: "#0f0f0f",
              }}
            >
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#333" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#333" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#333" }} />
              <div
                style={{
                  flex: 1,
                  marginLeft: "0.75rem",
                  padding: "0.25rem 0.75rem",
                  background: colors.bg,
                  borderRadius: "3px",
                  fontFamily: fonts.body,
                  fontSize: "0.6875rem",
                  color: colors.textDim,
                }}
              >
                {tenantSlug}.venuehub.app
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: fonts.body,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.accent,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Open ↗
              </a>
            </div>
            <iframe
              src={previewUrl}
              title="Your new site"
              style={{
                width: "100%",
                height: "70vh",
                border: "none",
                display: "block",
                background: "#fff",
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
            style={pillButton("solid")}
          >
            {completeMutation.isPending ? "Taking you in…" : "Go to Dashboard →"}
          </button>
          {previewUrl && (
            <a href={previewUrl} target="_blank" rel="noreferrer" style={pillButton("outline")}>
              Open Site in New Tab
            </a>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
