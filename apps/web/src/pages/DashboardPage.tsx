import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  CalendarCheck2,
  Users,
  TrendingUp,
  ArrowUpRight,
  CircleDot,
  ExternalLink,
} from "lucide-react";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";

const colors = {
  bg: "#f6f6f2",
  card: "#ffffff",
  border: "#e8e8e4",
  text: "#17171a",
  textMuted: "#6e6e76",
  textDim: "#9b9ba1",
  accent: "#c9a86a",
  accentSoft: "rgba(201,168,106,0.08)",
  accentBorder: "rgba(201,168,106,0.25)",
};

type LeadStatus = "new" | "contacted" | "quoted" | "negotiating" | "booked" | "lost";

const STAGE_ORDER: LeadStatus[] = ["new", "contacted", "quoted", "booked"];

const STAGE_STYLE: Record<LeadStatus, { label: string; bg: string; fg: string }> = {
  new: { label: "New", bg: "#eef4ff", fg: "#1d4ed8" },
  contacted: { label: "Contacted", bg: "#fef7ea", fg: "#b45309" },
  quoted: { label: "Quoted", bg: "#eef0ff", fg: "#4338ca" },
  negotiating: { label: "Negotiating", bg: "#fff4d9", fg: "#92400e" },
  booked: { label: "Booked", bg: "#e8f7ed", fg: "#15803d" },
  lost: { label: "Lost", bg: "#fbeaea", fg: "#b91c1c" },
};

function Metric({
  label,
  value,
  sublabel,
  Icon,
  accent,
}: {
  label: string;
  value: string;
  sublabel?: string;
  Icon: typeof DollarSign;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? "linear-gradient(135deg, rgba(201,168,106,0.08), rgba(201,168,106,0.02))" : colors.card,
        border: `1px solid ${accent ? colors.accentBorder : colors.border}`,
        borderRadius: "12px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        minHeight: "7.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.textMuted,
          }}
        >
          {label}
        </div>
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "8px",
            background: accent ? colors.accentSoft : "#f4f4ef",
            color: accent ? colors.accent : colors.textMuted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} strokeWidth={1.75} />
        </div>
      </div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: "2rem",
          fontWeight: 400,
          color: colors.text,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: "0.8125rem", color: colors.textMuted }}>{sublabel}</div>
      )}
    </div>
  );
}

function LeadCard({ name, eventType, budget }: { name: string; eventType?: string | null; budget?: number | null }) {
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
        padding: "0.75rem 0.875rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: colors.text }}>{name}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: colors.textMuted }}>
        <span>{eventType || "—"}</span>
        {budget ? <span style={{ color: colors.accent, fontWeight: 600 }}>${budget.toLocaleString()}</span> : null}
      </div>
    </div>
  );
}

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  at: Date;
  Icon: typeof DollarSign;
};

function relativeTime(from: Date): string {
  const now = Date.now();
  const delta = Math.max(0, now - from.getTime());
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return from.toLocaleDateString();
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const leadsQuery = trpc.leads.list.useQuery(undefined);
  const eventsQuery = trpc.events.list.useQuery(undefined);

  const leads = leadsQuery.data || [];
  const events = eventsQuery.data || [];

  const bookingsCount = events.length;
  const leadsCount = leads.length;
  const bookedLeadsCount = leads.filter((l) => l.status === "booked").length;
  const conversion = leadsCount > 0 ? Math.round((bookedLeadsCount / leadsCount) * 100) : 0;
  const revenue = events
    .filter((e) => e.status === "confirmed" || e.status === "completed")
    .reduce((sum, e) => sum + (parseFloat(e.totalAmount || "0") || 0), 0);

  const leadsByStage: Record<LeadStatus, typeof leads> = {
    new: [],
    contacted: [],
    quoted: [],
    negotiating: [],
    booked: [],
    lost: [],
  };
  for (const l of leads) {
    const key = (l.status ?? "new") as LeadStatus;
    if (leadsByStage[key]) leadsByStage[key].push(l);
  }

  const activity: ActivityItem[] = [
    ...leads.map<ActivityItem>((l) => ({
      id: `lead-${l.id}`,
      title: `New lead: ${l.name}`,
      detail: l.eventType || "Inquiry received",
      at: l.createdAt ? new Date(l.createdAt) : new Date(),
      Icon: Users,
    })),
    ...events.map<ActivityItem>((e) => ({
      id: `event-${e.id}`,
      title: `Booking: ${e.title}`,
      detail: `${e.clientName} · ${new Date(e.eventDate).toLocaleDateString()}`,
      at: e.createdAt ? new Date(e.createdAt) : new Date(),
      Icon: CalendarCheck2,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "1.75rem",
              fontWeight: 400,
              margin: 0,
              color: colors.text,
              letterSpacing: "-0.01em",
            }}
          >
            Welcome back, {user?.firstName}
          </h2>
          <p style={{ margin: "0.25rem 0 0", color: colors.textMuted, fontSize: "0.9375rem" }}>
            Here's what's happening at {user?.tenant?.name || "your venue"}.
          </p>
        </div>
        {user?.tenant?.slug && (
          <a
            href={`/v/${user.tenant.slug}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.125rem",
              borderRadius: "6px",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              color: colors.text,
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            View public site
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
          gap: "1rem",
        }}
      >
        <Metric
          label="Revenue"
          value={`$${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          sublabel="From confirmed & completed events"
          Icon={DollarSign}
          accent
        />
        <Metric
          label="Bookings"
          value={bookingsCount.toString()}
          sublabel={`${events.filter((e) => e.status === "pending").length} pending`}
          Icon={CalendarCheck2}
        />
        <Metric
          label="Leads"
          value={leadsCount.toString()}
          sublabel={`${leadsByStage.new.length} new this period`}
          Icon={Users}
        />
        <Metric
          label="Conversion"
          value={`${conversion}%`}
          sublabel={`${bookedLeadsCount} of ${leadsCount} booked`}
          Icon={TrendingUp}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <section
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <header
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "1.125rem",
                  fontWeight: 500,
                  color: colors.text,
                }}
              >
                Leads Pipeline
              </h3>
              <p style={{ margin: "0.125rem 0 0", fontSize: "0.8125rem", color: colors.textMuted }}>
                {leadsCount} total · {bookedLeadsCount} booked
              </p>
            </div>
            <Link
              to="/leads"
              style={{
                fontSize: "0.75rem",
                color: colors.accent,
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              View all <ArrowUpRight size={12} strokeWidth={2} />
            </Link>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${STAGE_ORDER.length}, minmax(0, 1fr))`,
              gap: "0.75rem",
              padding: "1rem",
              background: colors.bg,
            }}
          >
            {STAGE_ORDER.map((stage) => {
              const stageLeads = leadsByStage[stage];
              const style = STAGE_STYLE[stage];
              return (
                <div key={stage} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minHeight: "10rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.375rem 0.75rem",
                      background: style.bg,
                      color: style.fg,
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span>{style.label}</span>
                    <span style={{ opacity: 0.7 }}>{stageLeads.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {stageLeads.length === 0 ? (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: colors.textDim,
                          padding: "0.75rem",
                          textAlign: "center",
                          border: `1px dashed ${colors.border}`,
                          borderRadius: "6px",
                        }}
                      >
                        No leads yet
                      </div>
                    ) : (
                      stageLeads.slice(0, 4).map((l) => (
                        <LeadCard
                          key={l.id}
                          name={l.name}
                          eventType={l.eventType}
                          budget={l.budget as number | null | undefined}
                        />
                      ))
                    )}
                    {stageLeads.length > 4 && (
                      <div style={{ fontSize: "0.75rem", color: colors.textMuted, textAlign: "center", padding: "0.25rem" }}>
                        +{stageLeads.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
            <h3
              style={{
                margin: 0,
                fontFamily: '"Playfair Display", serif',
                fontSize: "1.125rem",
                fontWeight: 500,
                color: colors.text,
              }}
            >
              Recent Activity
            </h3>
          </header>
          <div style={{ padding: "0.5rem 0" }}>
            {activity.length === 0 ? (
              <div style={{ padding: "2rem 1.5rem", textAlign: "center", color: colors.textDim, fontSize: "0.875rem" }}>
                <CircleDot size={20} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
                <div>No activity yet.</div>
                <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                  Leads and bookings will appear here.
                </div>
              </div>
            ) : (
              activity.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: "0.75rem 1.5rem",
                    display: "flex",
                    gap: "0.875rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "8px",
                      background: colors.accentSoft,
                      color: colors.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <a.Icon size={14} strokeWidth={1.75} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: colors.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: colors.textMuted,
                        marginTop: "0.125rem",
                      }}
                    >
                      {a.detail} · {relativeTime(a.at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
