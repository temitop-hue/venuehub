import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
import { toCsv, downloadCsv } from "../lib/csv";

type LeadStatus = "new" | "contacted" | "quoted" | "negotiating" | "booked" | "lost";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "negotiating", "booked", "lost"];

const STATUS_COLOR: Record<LeadStatus, { bg: string; fg: string }> = {
  new: { bg: "#dbeafe", fg: "#1d4ed8" },
  contacted: { bg: "#fef3c7", fg: "#b45309" },
  quoted: { bg: "#e0e7ff", fg: "#4338ca" },
  negotiating: { bg: "#fde68a", fg: "#92400e" },
  booked: { bg: "#dcfce7", fg: "#15803d" },
  lost: { bg: "#fee2e2", fg: "#b91c1c" },
};

export function LeadsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    budget: "",
    source: "",
    notes: "",
  });

  const leadsQuery = trpc.leads.list.useQuery(statusFilter ? { status: statusFilter } : undefined);
  const allLeadsQuery = trpc.leads.list.useQuery(undefined);

  const createMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      allLeadsQuery.refetch();
      setFormData({
        name: "", email: "", phone: "", eventType: "", eventDate: "",
        guestCount: "", budget: "", source: "", notes: "",
      });
      setShowForm(false);
    },
  });

  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      allLeadsQuery.refetch();
    },
  });

  const deleteMutation = trpc.leads.delete.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      allLeadsQuery.refetch();
    },
  });

  const normalizeOptional = (v: string) => {
    const t = v.trim();
    return t === "" ? undefined : t;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createMutation.mutate({
      name: formData.name.trim(),
      email: normalizeOptional(formData.email),
      phone: normalizeOptional(formData.phone),
      eventType: normalizeOptional(formData.eventType),
      eventDate: normalizeOptional(formData.eventDate),
      guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
      budget: formData.budget ? parseInt(formData.budget) : undefined,
      source: normalizeOptional(formData.source),
      notes: normalizeOptional(formData.notes),
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const counts = STATUSES.reduce<Record<LeadStatus, number>>(
    (acc, s) => ({ ...acc, [s]: 0 }),
    { new: 0, contacted: 0, quoted: 0, negotiating: 0, booked: 0, lost: 0 },
  );
  for (const l of allLeadsQuery.data || []) {
    if (l.status) counts[l.status as LeadStatus]++;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }}>VenueHub</h1>
          <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button onClick={() => navigate("/dashboard")} style={navBtn}>Dashboard</button>
            <button onClick={() => navigate("/venues")} style={navBtn}>Venues</button>
            <button onClick={() => navigate("/events")} style={navBtn}>Events</button>
            <button onClick={() => navigate("/staff")} style={navBtn}>Staff</button>
            <button onClick={() => navigate("/leads")} style={{ ...navBtn, color: "#2563eb" }}>Leads</button>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }}>
              <span style={{ color: "#666" }}>{user?.firstName} {user?.lastName}</span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>Logout</button>
            </div>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Leads</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => {
                const rows = allLeadsQuery.data || [];
                if (rows.length === 0) return;
                const csv = toCsv(rows, [
                  { key: "id", label: "ID" },
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "eventType", label: "Event Type" },
                  { key: "eventDate", label: "Event Date" },
                  { key: "guestCount", label: "Guests" },
                  { key: "budget", label: "Budget" },
                  { key: "status", label: "Status" },
                  { key: "source", label: "Source" },
                  { key: "notes", label: "Notes" },
                  { key: "createdAt", label: "Created" },
                ]);
                downloadCsv(`leads-${new Date().toISOString().split("T")[0]}.csv`, csv);
              }}
              disabled={(allLeadsQuery.data || []).length === 0}
              style={{
                background: "white",
                color: "#2563eb",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "1px solid #2563eb",
                cursor: (allLeadsQuery.data || []).length === 0 ? "not-allowed" : "pointer",
                opacity: (allLeadsQuery.data || []).length === 0 ? 0.5 : 1,
              }}
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ background: "#2563eb", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}
            >
              {showForm ? "Cancel" : "Add Lead"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setStatusFilter("")} style={pillStyle(statusFilter === "")}>
            All ({allLeadsQuery.data?.length || 0})
          </button>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={pillStyle(statusFilter === s, STATUS_COLOR[s])}>
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        {showForm && (
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <Field label="Name *"><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={inputStyle} /></Field>
                <Field label="Email"><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} /></Field>
                <Field label="Phone"><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} /></Field>
                <Field label="Event Type"><input type="text" value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} placeholder="Wedding, Corporate…" style={inputStyle} /></Field>
                <Field label="Event Date"><input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} style={inputStyle} /></Field>
                <Field label="Guest Count"><input type="number" value={formData.guestCount} onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })} style={inputStyle} /></Field>
                <Field label="Budget"><input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} style={inputStyle} /></Field>
                <Field label="Source"><input type="text" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} placeholder="Referral, Web…" style={inputStyle} /></Field>
              </div>
              <Field label="Notes"><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={{ ...inputStyle, minHeight: "80px" }} /></Field>
              <button type="submit" disabled={createMutation.isPending} style={{ marginTop: "1rem", background: "#2563eb", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
                {createMutation.isPending ? "Saving…" : "Create Lead"}
              </button>
            </form>
          </div>
        )}

        {leadsQuery.isLoading && <p>Loading leads…</p>}
        {leadsQuery.error && <p style={{ color: "#ef4444" }}>Error loading leads</p>}
        {!leadsQuery.isLoading && (leadsQuery.data || []).length === 0 && (
          <p style={{ color: "#999" }}>
            {statusFilter ? `No ${statusFilter} leads.` : "No leads yet. Add one to start tracking."}
          </p>
        )}

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {(leadsQuery.data || []).map((lead) => {
            const color = STATUS_COLOR[(lead.status || "new") as LeadStatus];
            return (
              <div key={lead.id} style={{ background: "white", padding: "1rem 1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.25rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{lead.name}</h3>
                    <span style={{ background: color.bg, color: color.fg, padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500 }}>{lead.status}</span>
                  </div>
                  <div style={{ color: "#666", fontSize: "0.875rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {lead.email && <span>{lead.email}</span>}
                    {lead.phone && <span>{lead.phone}</span>}
                    {lead.eventType && <span>{lead.eventType}</span>}
                    {lead.eventDate && <span>📅 {new Date(lead.eventDate).toLocaleDateString()}</span>}
                    {lead.guestCount ? <span>👥 {lead.guestCount}</span> : null}
                    {lead.budget ? <span>💰 ${lead.budget.toLocaleString()}</span> : null}
                    {lead.source && <span>via {lead.source}</span>}
                  </div>
                  {lead.notes && <p style={{ color: "#555", fontSize: "0.875rem", marginTop: "0.5rem" }}>{lead.notes}</p>}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <select
                    value={lead.status || "new"}
                    onChange={(e) => updateStatusMutation.mutate({ id: lead.id, status: e.target.value as LeadStatus })}
                    style={{ padding: "0.375rem 0.5rem", border: "1px solid #ddd", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => { if (confirm(`Delete lead "${lead.name}"?`)) deleteMutation.mutate({ id: lead.id }); }}
                    style={{ background: "#ef4444", color: "white", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const navBtn: React.CSSProperties = { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: 500 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", boxSizing: "border-box" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

function pillStyle(active: boolean, color?: { bg: string; fg: string }): React.CSSProperties {
  if (active && color) {
    return { background: color.fg, color: "white", padding: "0.375rem 0.875rem", borderRadius: "9999px", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, textTransform: "capitalize" };
  }
  if (active) {
    return { background: "#2563eb", color: "white", padding: "0.375rem 0.875rem", borderRadius: "9999px", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 };
  }
  return { background: "white", color: "#666", padding: "0.375rem 0.875rem", borderRadius: "9999px", border: "1px solid #e5e7eb", cursor: "pointer", fontSize: "0.875rem", textTransform: "capitalize" };
}
