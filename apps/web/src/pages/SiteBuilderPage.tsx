import React from "react";
import { Palette, ExternalLink } from "lucide-react";
import { useAuthStore } from "../store/auth";

export function SiteBuilderPage() {
  const { user } = useAuthStore();
  const slug = user?.tenant?.slug;

  return (
    <div
      style={{
        minHeight: "24rem",
        background: "white",
        border: "1px solid #e8e8e4",
        borderRadius: "12px",
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "12px",
          background: "rgba(201,168,106,0.1)",
          color: "#c9a86a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Palette size={24} strokeWidth={1.75} />
      </div>
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: "1.75rem",
          fontWeight: 400,
          color: "#17171a",
          margin: 0,
        }}
      >
        Website Builder
      </h2>
      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: "0.9375rem",
          color: "#6e6e76",
          marginTop: "0.75rem",
          maxWidth: "32rem",
          lineHeight: 1.6,
        }}
      >
        Drag-and-drop blocks, live preview, and schema-driven editing for every
        section of your site. Your current site is live and ready to view.
      </p>
      {slug && (
        <a
          href={`/v/${slug}`}
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: "1.75rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#c9a86a",
            color: "#0d0d0d",
            borderRadius: "4px",
            textDecoration: "none",
            fontFamily: '"Inter", sans-serif',
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          View Live Site <ExternalLink size={14} strokeWidth={2} />
        </a>
      )}
      <span
        style={{
          marginTop: "1.5rem",
          padding: "0.25rem 0.75rem",
          background: "rgba(201,168,106,0.08)",
          border: "1px solid rgba(201,168,106,0.25)",
          borderRadius: "999px",
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#c9a86a",
        }}
      >
        Editor Coming Soon
      </span>
    </div>
  );
}
