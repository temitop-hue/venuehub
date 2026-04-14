import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/auth";

const colors = {
  bg: "#ffffff",
  border: "#e8e8e4",
  text: "#17171a",
  textMuted: "#6e6e76",
  accent: "#c9a86a",
};

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/events": "Bookings",
  "/calendar": "Calendar",
  "/payments": "Payments",
  "/guests": "Guests",
  "/site": "Website Builder",
  "/venues": "Venues",
  "/staff": "Staff",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function Topbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const title = TITLES[pathname] ?? "Dashboard";
  const initials =
    ((user?.firstName ?? "U")[0] + (user?.lastName ?? "")[0]).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      style={{
        height: "4rem",
        minHeight: "4rem",
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        padding: "0 clamp(1rem, 3vw, 2rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: colors.text,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h1>

      <div style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.375rem 0.625rem 0.375rem 0.375rem",
            background: "transparent",
            border: `1px solid ${colors.border}`,
            borderRadius: "999px",
            cursor: "pointer",
            color: colors.text,
          }}
        >
          <span
            style={{
              width: "1.875rem",
              height: "1.875rem",
              borderRadius: "50%",
              background: colors.accent,
              color: "#0d0d0d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            {initials}
          </span>
          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            {user?.firstName}
          </span>
          <ChevronDown size={14} strokeWidth={2} color={colors.textMuted} />
        </button>

        {menuOpen && (
          <>
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 20,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                minWidth: "14rem",
                zIndex: 21,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: colors.text }}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "0.125rem" }}>
                  {user?.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.625rem 1rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#b91c1c",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textAlign: "left",
                }}
              >
                <LogOut size={14} strokeWidth={2} />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
