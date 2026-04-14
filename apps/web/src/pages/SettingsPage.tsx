import React from "react";
import { useAuthStore } from "../store/auth";

const colors = {
  card: "#ffffff",
  border: "#e8e8e4",
  text: "#17171a",
  textMuted: "#6e6e76",
  textDim: "#9b9ba1",
  accent: "#c9a86a",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(10rem, 1fr) 2fr",
        padding: "1rem 1.5rem",
        borderBottom: `1px solid ${colors.border}`,
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: colors.textMuted,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.9375rem", color: value ? colors.text : colors.textDim }}>
        {value || "—"}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div style={{ maxWidth: "48rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <header style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${colors.border}` }}>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", serif',
              fontSize: "1.25rem",
              fontWeight: 500,
              color: colors.text,
            }}
          >
            Venue
          </h2>
        </header>
        <Row label="Name" value={user?.tenant?.name} />
        <Row label="Slug" value={user?.tenant?.slug} />
        <Row
          label="Public URL"
          value={user?.tenant?.slug ? `venuehub.app/v/${user.tenant.slug}` : null}
        />
      </section>

      <section
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <header style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${colors.border}` }}>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", serif',
              fontSize: "1.25rem",
              fontWeight: 500,
              color: colors.text,
            }}
          >
            Your account
          </h2>
        </header>
        <Row label="Name" value={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()} />
        <Row label="Email" value={user?.email} />
        <Row label="Role" value={user?.role} />
      </section>

      <p style={{ fontSize: "0.8125rem", color: colors.textMuted }}>
        Editing venue details, branding, and user invitations will be available in a future release.
      </p>
    </div>
  );
}
