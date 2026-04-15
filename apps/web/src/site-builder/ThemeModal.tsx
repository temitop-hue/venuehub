import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { trpc } from "../trpc";

const colors = {
  border: "#e8e8e4",
  text: "#17171a",
  textMuted: "#6e6e76",
  accent: "#c9a86a",
  danger: "#b91c1c",
};

const HEADING_FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Inter",
  "Inter Tight",
  "Lato",
];
const BODY_FONTS = ["Inter", "Lato", "Cormorant Garamond", "Playfair Display"];

export function ThemeModal({ onClose }: { onClose: () => void }) {
  const themeQuery = trpc.siteAdmin.getTheme.useQuery();
  const utils = trpc.useContext();
  const updateMutation = trpc.siteAdmin.updateTheme.useMutation({
    onSuccess: async () => {
      await utils.siteAdmin.getTheme.invalidate();
      onClose();
    },
  });

  const t = themeQuery.data;

  const [primaryColor, setPrimaryColor] = useState("#0d0d0d");
  const [secondaryColor, setSecondaryColor] = useState("#f7f3ea");
  const [accentColor, setAccentColor] = useState("#c9a86a");
  const [headingFont, setHeadingFont] = useState("Playfair Display");
  const [bodyFont, setBodyFont] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState(2);

  useEffect(() => {
    if (!t) return;
    setPrimaryColor(t.primaryColor);
    setSecondaryColor(t.secondaryColor);
    setAccentColor(t.accentColor);
    setHeadingFont(t.headingFont);
    setBodyFont(t.bodyFont);
    setBorderRadius(t.borderRadius);
  }, [t?.id]);

  const save = () => {
    updateMutation.mutate({
      primaryColor,
      secondaryColor,
      accentColor,
      headingFont,
      bodyFont,
      borderRadius,
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "36rem",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
      >
        <header
          style={{
            padding: "1rem 1.25rem",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: "1.125rem", fontWeight: 500 }}>
            Theme & branding
          </h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textMuted, padding: "0.25rem" }}>
            <X size={16} />
          </button>
        </header>

        <div style={{ padding: "1.25rem" }}>
          {themeQuery.isLoading ? (
            <div style={{ textAlign: "center", color: colors.textMuted }}>Loading…</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Section title="Colors">
                <ColorField label="Primary (text + dark sections)" value={primaryColor} onChange={setPrimaryColor} />
                <ColorField label="Secondary (page background)" value={secondaryColor} onChange={setSecondaryColor} />
                <ColorField label="Accent (CTAs + highlights)" value={accentColor} onChange={setAccentColor} />
              </Section>

              <Section title="Typography">
                <SelectField label="Heading font" value={headingFont} onChange={setHeadingFont} options={HEADING_FONTS} />
                <SelectField label="Body font" value={bodyFont} onChange={setBodyFont} options={BODY_FONTS} />
              </Section>

              <Section title="Shape">
                <div>
                  <Label>Corner radius</Label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={1}
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(Number(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ width: "3rem", fontSize: "0.875rem", color: colors.text, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {borderRadius}px
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "0.25rem" }}>
                    0 for sharp edges (luxury/minimal), 8–12 for modern, 4 for classic.
                  </div>
                </div>
              </Section>

              <Section title="Preview">
                <div
                  style={{
                    padding: "1.5rem",
                    background: secondaryColor,
                    color: primaryColor,
                    borderRadius: `${borderRadius}px`,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: `"${headingFont}", serif`,
                      fontSize: "1.75rem",
                      fontWeight: 400,
                      lineHeight: 1.15,
                      marginBottom: "0.5rem",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Your heading looks like this.
                  </div>
                  <p
                    style={{
                      fontFamily: `"${bodyFont}", sans-serif`,
                      fontSize: "0.9375rem",
                      lineHeight: 1.6,
                      margin: "0 0 1rem",
                      opacity: 0.8,
                    }}
                  >
                    And your body copy looks like this. Every block on your site uses the same
                    tokens, so changing these repaints the whole site.
                  </p>
                  <button
                    style={{
                      padding: "0.75rem 1.25rem",
                      background: accentColor,
                      color: primaryColor,
                      border: "none",
                      borderRadius: `${borderRadius}px`,
                      fontFamily: `"${bodyFont}", sans-serif`,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "default",
                    }}
                  >
                    Primary CTA
                  </button>
                </div>
              </Section>

              {updateMutation.error && (
                <div
                  style={{
                    padding: "0.625rem 0.75rem",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "4px",
                    color: colors.danger,
                    fontSize: "0.8125rem",
                  }}
                >
                  {updateMutation.error.message}
                </div>
              )}
            </div>
          )}
        </div>

        <footer
          style={{
            padding: "0.875rem 1.25rem",
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
              color: colors.text,
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={updateMutation.isPending || themeQuery.isLoading}
            style={{
              padding: "0.5rem 1rem",
              background: colors.accent,
              color: "#0d0d0d",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: updateMutation.isPending ? "not-allowed" : "pointer",
              opacity: updateMutation.isPending ? 0.6 : 1,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <Save size={14} strokeWidth={2.25} />
            {updateMutation.isPending ? "Saving…" : "Save theme"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div
        style={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.textMuted,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: colors.textMuted,
        marginBottom: "0.375rem",
      }}
    >
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "3rem",
            height: "2.25rem",
            padding: 0,
            border: `1px solid ${colors.border}`,
            borderRadius: "4px",
            cursor: "pointer",
            background: "transparent",
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            fontFamily: '"SF Mono", Menlo, Consolas, monospace',
            fontSize: "0.8125rem",
            color: colors.text,
            background: "white",
            border: `1px solid ${colors.border}`,
            borderRadius: "4px",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          fontFamily: `"${value}", sans-serif`,
          fontSize: "0.9375rem",
          color: colors.text,
          background: "white",
          border: `1px solid ${colors.border}`,
          borderRadius: "4px",
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
