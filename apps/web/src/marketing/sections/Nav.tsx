import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { colors, fonts, pillButton } from "../styles";

export function Nav() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLink: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    padding: "0.5rem 0.75rem",
    transition: "color 0.2s ease",
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${colors.border}` : "1px solid transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "1rem clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: "1.5rem",
              fontWeight: 500,
              color: colors.text,
              letterSpacing: "-0.02em",
            }}
          >
            VenueHub
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <button onClick={() => scrollTo("features")} style={navLink}>Features</button>
          <button onClick={() => scrollTo("templates")} style={navLink}>Templates</button>
          <button onClick={() => scrollTo("pricing")} style={navLink}>Pricing</button>
          <button
            onClick={() => window.open("/v/demo", "_blank")}
            style={navLink}
          >
            Live Demo
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {token ? (
            <a href="/dashboard" style={pillButton("solid")}>
              Go to Dashboard
            </a>
          ) : (
            <>
              <a href="/login" style={{ ...navLink, color: colors.text }}>
                Login
              </a>
              <a href="/login" style={pillButton("solid")}>
                Start Free Trial
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
