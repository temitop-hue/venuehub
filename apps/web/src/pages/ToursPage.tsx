import React from "react";
import { CalendarCheck2 } from "lucide-react";
import { trpc } from "../trpc";

const colors = {
  card: "#ffffff",
  border: "#e8e8e4",
  text: "#17171a",
  textMuted: "#6e6e76",
  textDim: "#9b9ba1",
  accent: "#c9a86a",
};

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  confirmed: { bg: "#eef7f0", fg: "#15803d" },
  cancelled: { bg: "#fbeaea", fg: "#b91c1c" },
  completed: { bg: "#eef4ff", fg: "#1d4ed8" },
  no_show: { bg: "#fef7ea", fg: "#b45309" },
};

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatTime12(hhmm: string) {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m < 10 ? "0" : ""}${m} ${period}`;
}

export function ToursPage() {
  const toursQuery = trpc.tours.list.useQuery();
  const utils = trpc.useContext();
  const updateMutation = trpc.tours.updateStatus.useMutation({
    onSuccess: () => utils.tours.list.invalidate(),
  });

  const tours = toursQuery.data ?? [];
  const upcoming = tours.filter((t) => t.status === "confirmed" && t.tourDate >= new Date().toISOString().slice(0, 10));
  const past = tours.filter((t) => t.status !== "confirmed" || t.tourDate < new Date().toISOString().slice(0, 10));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <header>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "1.75rem",
            fontWeight: 400,
            margin: 0,
            color: colors.text,
          }}
        >
          Tour bookings
        </h2>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.9375rem", color: colors.textMuted }}>
          {upcoming.length} upcoming · {tours.length} total
        </p>
      </header>

      <Section title="Upcoming" items={upcoming} updateMutation={updateMutation} empty="No upcoming tours booked." />

      <Section title="Past & cancelled" items={past} updateMutation={updateMutation} empty="No past tours." />
    </div>
  );
}

function Section({
  title,
  items,
  updateMutation,
  empty,
}: {
  title: string;
  items: any[];
  updateMutation: any;
  empty: string;
}) {
  return (
    <section
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <header style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${colors.border}` }}>
        <h3
          style={{
            margin: 0,
            fontFamily: '"Playfair Display", serif',
            fontSize: "1.125rem",
            fontWeight: 500,
            color: colors.text,
          }}
        >
          {title}
        </h3>
      </header>
      {items.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: colors.textDim }}>
          <CalendarCheck2 size={24} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
          <div style={{ fontSize: "0.875rem" }}>{empty}</div>
        </div>
      ) : (
        <div>
          {items.map((t) => {
            const color = STATUS_COLORS[t.status] ?? STATUS_COLORS.confirmed;
            return (
              <div
                key={t.id}
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: `1px solid ${colors.border}`,
                  display: "grid",
                  gridTemplateColumns: "10rem 1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: colors.text }}>
                    {formatDate(t.tourDate)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "0.125rem" }}>
                    {formatTime12(t.tourTime)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: colors.text }}>{t.name}</div>
                  <div style={{ fontSize: "0.8125rem", color: colors.textMuted, marginTop: "0.125rem" }}>
                    {t.email}
                    {t.phone ? ` · ${t.phone}` : ""}
                    {t.eventType ? ` · ${t.eventType}` : ""}
                    {t.guestCount ? ` · ${t.guestCount} guests` : ""}
                  </div>
                  {t.message && (
                    <div style={{ fontSize: "0.8125rem", color: colors.textMuted, marginTop: "0.375rem", fontStyle: "italic" }}>
                      "{t.message}"
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.625rem",
                      background: color.bg,
                      color: color.fg,
                      borderRadius: "999px",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  <select
                    value={t.status}
                    onChange={(e) => updateMutation.mutate({ id: t.id, status: e.target.value as any })}
                    style={{
                      padding: "0.375rem 0.5rem",
                      background: "white",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "4px",
                      fontSize: "0.8125rem",
                      color: colors.text,
                      cursor: "pointer",
                    }}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No-show</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
