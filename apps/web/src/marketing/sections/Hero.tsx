import React from "react";
import { colors, fonts, pillButton } from "../styles";

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: "7rem",
        paddingBottom: "4rem",
        paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
        paddingRight: "clamp(1.5rem, 5vw, 4rem)",
        background: `radial-gradient(ellipse at top right, rgba(201,168,106,0.08), transparent 60%), ${colors.bg}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(28rem, 100%), 1fr))",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.875rem",
              background: "rgba(201,168,106,0.08)",
              border: `1px solid rgba(201,168,106,0.25)`,
              borderRadius: "999px",
              fontFamily: fonts.body,
              fontSize: "0.75rem",
              color: colors.accent,
              fontWeight: 500,
              letterSpacing: "0.1em",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
            NEW · LAUNCHING 2026
          </div>

          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: colors.text,
              margin: 0,
            }}
          >
            Build a luxury venue site
            <br />
            <span style={{ color: colors.accent, fontStyle: "italic" }}>in minutes.</span>
          </h1>

          <p
            style={{
              fontFamily: fonts.body,
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: colors.textMuted,
              marginTop: "1.75rem",
              maxWidth: "34rem",
            }}
          >
            Website, booking system, CRM, and payments — all in one platform.
            Designed for modern event venues that want to get booked, get paid, and look the part.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            <a href="/login" style={pillButton("solid")}>
              Start Free Trial
            </a>
            <a href="/v/demo" target="_blank" style={pillButton("outline")}>
              See Live Demo →
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginTop: "2.5rem",
              fontFamily: fonts.body,
              fontSize: "0.8125rem",
              color: colors.textDim,
            }}
          >
            <span>✦ 14-day free trial</span>
            <span style={{ width: "1px", height: "12px", background: colors.border }} />
            <span>✦ No credit card</span>
            <span style={{ width: "1px", height: "12px", background: colors.border }} />
            <span>✦ Cancel anytime</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              boxShadow:
                "0 50px 100px -20px rgba(0,0,0,0.6), 0 30px 60px -30px rgba(201,168,106,0.15)",
              background: colors.bgElevated,
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
                maisonlumiere.venuehub.app
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80"
              alt="Tenant venue site preview"
              style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-1.5rem",
                right: "-1.5rem",
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                padding: "1rem 1.25rem",
                fontFamily: fonts.body,
                fontSize: "0.8125rem",
                color: colors.textMuted,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(201,168,106,0.15)",
                  color: colors.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                ✦
              </div>
              <div>
                <div style={{ color: colors.text, fontWeight: 600 }}>New booking</div>
                <div style={{ fontSize: "0.75rem" }}>$12,500 · Sat, Jun 14</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
