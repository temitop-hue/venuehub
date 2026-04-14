import type { CSSProperties } from "react";

export const section = (paddingY: "sm" | "md" | "lg" | "xl" = "lg"): CSSProperties => {
  const py =
    paddingY === "sm" ? "3rem" : paddingY === "md" ? "4.5rem" : paddingY === "lg" ? "6.5rem" : "9rem";
  return {
    paddingTop: py,
    paddingBottom: py,
    paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
    paddingRight: "clamp(1.5rem, 5vw, 4rem)",
  };
};

export const container = (maxWidth: "narrow" | "medium" | "wide" = "medium"): CSSProperties => {
  const mw = maxWidth === "narrow" ? "48rem" : maxWidth === "medium" ? "64rem" : "80rem";
  return { maxWidth: mw, marginLeft: "auto", marginRight: "auto" };
};

export const eyebrow: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "var(--color-accent)",
  marginBottom: "1rem",
};

export const heading: CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
  fontWeight: 400,
  lineHeight: 1.1,
  letterSpacing: "-0.015em",
  color: "var(--color-primary)",
  margin: 0,
};

export const subheading: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "clamp(1rem, 1.4vw, 1.125rem)",
  lineHeight: 1.7,
  color: "var(--color-primary)",
  opacity: 0.75,
  marginTop: "1.25rem",
  maxWidth: "40rem",
};

export const bodyText: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1.0625rem",
  lineHeight: 1.75,
  color: "var(--color-primary)",
  opacity: 0.85,
};

export const pillButton = (variant: "solid" | "outline" = "solid"): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.9rem 2.25rem",
  background: variant === "solid" ? "var(--color-accent)" : "transparent",
  color: variant === "solid" ? "var(--color-primary)" : "var(--color-accent)",
  border: variant === "solid" ? "none" : "1px solid var(--color-accent)",
  textDecoration: "none",
  fontFamily: "var(--font-body)",
  fontSize: "0.8125rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  borderRadius: "var(--radius)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  cursor: "pointer",
});

export const divider: CSSProperties = {
  width: "48px",
  height: "1px",
  background: "var(--color-accent)",
  margin: "1.5rem auto",
};
