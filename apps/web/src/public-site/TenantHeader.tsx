import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export interface PublishedPage {
  id?: number;
  slug?: string;
  title?: string;
  displayOrder?: number;
}

export function TenantHeader({
  tenantSlug,
  tenantName,
  logoUrl,
  pages,
  currentPageSlug,
}: {
  tenantSlug: string;
  tenantName: string;
  logoUrl?: string | null;
  pages: PublishedPage[];
  currentPageSlug: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const homeHref = `/v/${tenantSlug}`;
  const visiblePages = pages.length > 0 ? pages : [{ id: 0, slug: "home", title: "Home", displayOrder: 0 }];

  const linkFor = (s?: string) => (!s || s === "home" ? homeHref : `${homeHref}/${s}`);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "var(--color-secondary)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(12px)" : "none",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: "82rem",
          margin: "0 auto",
          padding: "1rem clamp(1.25rem, 4vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link
          to={homeHref}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
            color: scrolled ? "var(--color-primary)" : "white",
            transition: "color 0.25s ease",
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={tenantName} style={{ height: "2rem", display: "block" }} />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              {tenantName}
            </span>
          )}
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="vh-public-nav"
        >
          {visiblePages.map((p) => {
            const pSlug = p.slug ?? "home";
            const isActive = (pSlug === "home" && currentPageSlug === "home") || pSlug === currentPageSlug;
            return (
              <Link
                key={p.id ?? pSlug}
                to={linkFor(pSlug)}
                style={{
                  padding: "0.5rem 0.875rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: scrolled
                    ? isActive
                      ? "var(--color-accent)"
                      : "var(--color-primary)"
                    : "white",
                  opacity: isActive ? 1 : 0.85,
                  textDecoration: "none",
                  borderBottom: isActive ? "1px solid var(--color-accent)" : "1px solid transparent",
                  transition: "color 0.25s ease, opacity 0.25s ease",
                }}
              >
                {p.title}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="vh-mobile-toggle"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: scrolled ? "var(--color-primary)" : "white",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </div>

      {open && (
        <div
          className="vh-mobile-menu"
          style={{
            background: "var(--color-secondary)",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            padding: "0.5rem 1rem 1rem",
          }}
        >
          {visiblePages.map((p) => {
            const pSlug = p.slug ?? "home";
            return (
              <Link
                key={p.id ?? pSlug}
                to={linkFor(pSlug)}
                style={{
                  display: "block",
                  padding: "0.75rem 0.5rem",
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                }}
              >
                {p.title}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .vh-public-nav { display: none !important; }
          .vh-mobile-toggle { display: inline-flex !important; }
        }
        @media (min-width: 721px) {
          .vh-mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
