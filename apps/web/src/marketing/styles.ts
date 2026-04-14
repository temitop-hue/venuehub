import type { CSSProperties } from "react";

export const colors = {
  bg: "#0a0a0a",
  bgAlt: "#0d0d0d",
  bgElevated: "#141414",
  border: "#262626",
  text: "#f5f5f1",
  textMuted: "#8a8a85",
  textDim: "#555",
  accent: "#c9a86a",
  accentHover: "#b89658",
};

export const fonts = {
  heading: '"Playfair Display", serif',
  body: '"Inter", sans-serif',
};

export const section = (paddingY: number = 8): CSSProperties => ({
  paddingTop: `${paddingY}rem`,
  paddingBottom: `${paddingY}rem`,
  paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
  paddingRight: "clamp(1.5rem, 5vw, 4rem)",
});

export const container = (maxWidth: number = 72): CSSProperties => ({
  maxWidth: `${maxWidth}rem`,
  marginLeft: "auto",
  marginRight: "auto",
});

export const eyebrow: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.accent,
  marginBottom: "1rem",
};

export const h2: CSSProperties = {
  fontFamily: fonts.heading,
  fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
  fontWeight: 400,
  lineHeight: 1.1,
  letterSpacing: "-0.015em",
  color: colors.text,
  margin: 0,
};

export const lead: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: "clamp(1rem, 1.4vw, 1.125rem)",
  lineHeight: 1.7,
  color: colors.textMuted,
  marginTop: "1.25rem",
  maxWidth: "40rem",
};

export const pillButton = (variant: "solid" | "outline" | "ghost" = "solid"): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.875rem 2rem",
  background:
    variant === "solid" ? colors.accent : variant === "outline" ? "transparent" : "transparent",
  color:
    variant === "solid" ? "#0a0a0a" : variant === "outline" ? colors.text : colors.textMuted,
  border:
    variant === "solid"
      ? "none"
      : variant === "outline"
        ? `1px solid ${colors.border}`
        : "none",
  textDecoration: "none",
  fontFamily: fonts.body,
  fontSize: "0.875rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  borderRadius: "3px",
  cursor: "pointer",
  transition: "background 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
  whiteSpace: "nowrap",
});

export const divider: CSSProperties = {
  width: "48px",
  height: "1px",
  background: colors.accent,
  margin: "1.5rem 0",
};
