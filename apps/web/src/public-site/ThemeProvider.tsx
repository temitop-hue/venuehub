import React, { useEffect } from "react";

export interface TenantTheme {
  tone?: "luxury" | "modern" | "minimal" | "classic" | "corporate";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
  heroOverlayOpacity?: string | number;
  borderRadius?: number;
  logoUrl?: string | null;
}

const DEFAULTS: Required<Omit<TenantTheme, "logoUrl">> = {
  tone: "luxury",
  primaryColor: "#0d0d0d",
  secondaryColor: "#f7f3ea",
  accentColor: "#c9a86a",
  headingFont: "Playfair Display",
  bodyFont: "Inter",
  heroOverlayOpacity: 0.45,
  borderRadius: 2,
};

export function ThemeProvider({
  theme,
  children,
}: {
  theme: TenantTheme | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const t = { ...DEFAULTS, ...(theme ?? {}) };
    const root = document.documentElement;
    root.style.setProperty("--color-primary", t.primaryColor);
    root.style.setProperty("--color-secondary", t.secondaryColor);
    root.style.setProperty("--color-accent", t.accentColor);
    root.style.setProperty("--font-heading", `"${t.headingFont}", serif`);
    root.style.setProperty("--font-body", `"${t.bodyFont}", sans-serif`);
    root.style.setProperty("--hero-overlay", String(t.heroOverlayOpacity));
    root.style.setProperty("--radius", `${t.borderRadius}px`);
    root.style.setProperty("--tone", t.tone);
  }, [theme]);

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-primary)",
        background: "var(--color-secondary)",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
