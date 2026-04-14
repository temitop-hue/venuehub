import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  CalendarDays,
  CreditCard,
  Contact2,
  Palette,
  Building2,
  UserCog,
  BarChart3,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "../store/auth";

const sidebarColors = {
  bg: "#0b0b0c",
  bgHover: "#15151a",
  bgActive: "#1d1d24",
  border: "#22222a",
  text: "#e8e8e3",
  textMuted: "#7c7c82",
  textDim: "#4d4d54",
  accent: "#c9a86a",
};

const NAV_PRIMARY = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/leads", label: "Leads", Icon: Users },
  { to: "/events", label: "Bookings", Icon: CalendarCheck2 },
  { to: "/calendar", label: "Calendar", Icon: CalendarDays },
  { to: "/payments", label: "Payments", Icon: CreditCard },
  { to: "/guests", label: "Guests", Icon: Contact2 },
];

const NAV_DESIGN = [{ to: "/site", label: "Website Builder", Icon: Palette }];

const NAV_OPS = [
  { to: "/venues", label: "Venues", Icon: Building2 },
  { to: "/staff", label: "Staff", Icon: UserCog },
  { to: "/analytics", label: "Analytics", Icon: BarChart3 },
];

const NAV_SYSTEM = [{ to: "/settings", label: "Settings", Icon: Settings }];

export const SIDEBAR_WIDTH = 248;

function Section({ items, label }: { items: typeof NAV_PRIMARY; label?: string }) {
  return (
    <div style={{ padding: "0 0.5rem" }}>
      {label && (
        <div
          style={{
            padding: "0.75rem 0.75rem 0.375rem",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: sidebarColors.textDim,
          }}
        >
          {label}
        </div>
      )}
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.75rem",
            borderRadius: "6px",
            color: isActive ? sidebarColors.text : sidebarColors.textMuted,
            background: isActive ? sidebarColors.bgActive : "transparent",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            margin: "1px 0",
            transition: "background 0.15s ease, color 0.15s ease",
          })}
        >
          {({ isActive }) => (
            <>
              <span
                style={{
                  width: "2px",
                  height: "18px",
                  background: isActive ? sidebarColors.accent : "transparent",
                  borderRadius: "2px",
                  marginLeft: "-0.75rem",
                  marginRight: "0.5rem",
                }}
              />
              <Icon
                size={16}
                strokeWidth={1.75}
                color={isActive ? sidebarColors.accent : sidebarColors.textMuted}
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { user } = useAuthStore();
  const tenantSlug = user?.tenant?.slug;

  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        background: sidebarColors.bg,
        borderRight: `1px solid ${sidebarColors.border}`,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1.25rem 1.25rem 1rem",
          borderBottom: `1px solid ${sidebarColors.border}`,
        }}
      >
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "1.375rem",
            fontWeight: 500,
            color: sidebarColors.text,
            letterSpacing: "-0.02em",
          }}
        >
          VenueHub
        </div>
        {user?.tenant && (
          <div
            style={{
              fontSize: "0.75rem",
              color: sidebarColors.textMuted,
              marginTop: "0.25rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.tenant.name}
          </div>
        )}
      </div>

      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Section items={NAV_PRIMARY} />
        <Section items={NAV_DESIGN} label="Design" />
        <Section items={NAV_OPS} label="Operations" />
        <Section items={NAV_SYSTEM} label="System" />
      </nav>

      {tenantSlug && (
        <a
          href={`/v/${tenantSlug}`}
          target="_blank"
          rel="noreferrer"
          style={{
            margin: "0.75rem 1rem 1rem",
            padding: "0.75rem",
            borderRadius: "6px",
            background: "rgba(201,168,106,0.06)",
            border: `1px solid rgba(201,168,106,0.2)`,
            color: sidebarColors.accent,
            textDecoration: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <span>View Live Site</span>
          <ExternalLink size={14} strokeWidth={2} />
        </a>
      )}
    </aside>
  );
}
