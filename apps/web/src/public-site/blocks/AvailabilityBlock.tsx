import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AvailabilityBlockData } from "@venuehub/shared";
import { trpc } from "../../trpc";
import { section, container, eyebrow, heading, subheading, divider } from "../primitives";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function AvailabilityBlock(props: AvailabilityBlockData) {
  const { slug } = useParams<{ slug: string }>();
  const [monthAnchor, setMonthAnchor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const fromDate = toDateStr(monthAnchor);
  const toDate = toDateStr(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0));

  const availQuery = trpc.availability.getPublic.useQuery(
    { slug: slug ?? "", fromDate, toDate },
    { enabled: Boolean(slug) },
  );

  const blockedSet = useMemo(() => new Set(availQuery.data?.blockedDates ?? []), [availQuery.data]);
  const bookedSet = useMemo(() => new Set(availQuery.data?.bookedDates ?? []), [availQuery.data]);

  const days = buildMonthGrid(monthAnchor);
  const today = toDateStr(new Date());
  const canGoBack = (() => {
    const prev = new Date(monthAnchor);
    prev.setMonth(prev.getMonth() - 1);
    return prev >= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  })();
  const maxAnchor = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + (props.monthsAhead - 1));
    d.setDate(1);
    return d;
  })();
  const canGoForward = monthAnchor < maxAnchor;

  return (
    <section style={{ background: "var(--color-secondary)", ...section("lg") }}>
      <div style={{ ...container("narrow") }}>
        <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {props.eyebrow && <div style={eyebrow}>{props.eyebrow}</div>}
          {props.heading && <h2 style={heading}>{props.heading}</h2>}
          {props.heading && <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />}
          {props.subheading && (
            <p style={{ ...subheading, marginLeft: "auto", marginRight: "auto" }}>{props.subheading}</p>
          )}
        </header>

        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => {
                const next = new Date(monthAnchor);
                next.setMonth(next.getMonth() - 1);
                setMonthAnchor(next);
              }}
              disabled={!canGoBack}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-primary)",
                cursor: canGoBack ? "pointer" : "not-allowed",
                opacity: canGoBack ? 1 : 0.3,
                padding: "0.25rem",
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 500,
                color: "var(--color-primary)",
              }}
            >
              {monthAnchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <button
              onClick={() => {
                const next = new Date(monthAnchor);
                next.setMonth(next.getMonth() + 1);
                setMonthAnchor(next);
              }}
              disabled={!canGoForward}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-primary)",
                cursor: canGoForward ? "pointer" : "not-allowed",
                opacity: canGoForward ? 1 : 0.3,
                padding: "0.25rem",
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "var(--color-primary)",
                  opacity: 0.55,
                  padding: "0.5rem 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const str = toDateStr(d);
              const isPast = str < today;
              const isBooked = bookedSet.has(str);
              const isBlocked = blockedSet.has(str);
              const isTaken = isBooked || isBlocked;
              return (
                <div
                  key={i}
                  title={isBooked ? "Booked" : isBlocked ? "Unavailable" : isPast ? "Past" : "Available"}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--color-primary)",
                    opacity: isPast ? 0.25 : isTaken ? 0.4 : 0.95,
                    background: isTaken ? "rgba(0,0,0,0.08)" : "transparent",
                    textDecoration: isTaken ? "line-through" : "none",
                    cursor: "default",
                    position: "relative",
                  }}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              gap: "1.25rem",
              justifyContent: "center",
              flexWrap: "wrap",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-primary)",
              opacity: 0.7,
            }}
          >
            <LegendSwatch color="transparent" border label="Available" />
            <LegendSwatch color="rgba(0,0,0,0.08)" label="Booked / unavailable" strike />
          </div>
        </div>
      </div>
    </section>
  );
}

function LegendSwatch({
  color,
  border,
  label,
  strike,
}: {
  color: string;
  border?: boolean;
  label: string;
  strike?: boolean;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        style={{
          display: "inline-block",
          width: "1rem",
          height: "1rem",
          borderRadius: "var(--radius)",
          background: color,
          border: border ? "1px solid rgba(0,0,0,0.15)" : "none",
        }}
      />
      <span style={{ textDecoration: strike ? "line-through" : "none" }}>{label}</span>
    </span>
  );
}

function buildMonthGrid(anchor: Date): (Date | null)[] {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const firstDay = new Date(y, m, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
