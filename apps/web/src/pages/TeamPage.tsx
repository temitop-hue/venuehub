import React, { useState } from "react";
import { Copy, Check, X, UserPlus } from "lucide-react";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";

const colors = {
  card: "#ffffff",
  border: "#e8e8e4",
  text: "#17171a",
  textMuted: "#6e6e76",
  textDim: "#9b9ba1",
  accent: "#c9a86a",
  danger: "#b91c1c",
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  user: "Staff",
};

export function TeamPage() {
  const { user: currentUser } = useAuthStore();
  const membersQuery = trpc.team.listMembers.useQuery();
  const invitesQuery = trpc.team.listInvites.useQuery();
  const utils = trpc.useContext();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "user">("manager");
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const inviteMutation = trpc.team.invite.useMutation({
    onSuccess: async (res) => {
      setLastToken(res.token);
      setEmail("");
      await utils.team.listInvites.invalidate();
    },
  });

  const cancelInviteMutation = trpc.team.cancelInvite.useMutation({
    onSuccess: () => utils.team.listInvites.invalidate(),
  });

  const roleMutation = trpc.team.updateMemberRole.useMutation({
    onSuccess: () => utils.team.listMembers.invalidate(),
  });

  const removeMutation = trpc.team.removeMember.useMutation({
    onSuccess: () => utils.team.listMembers.invalidate(),
  });

  const members = (membersQuery.data ?? []).filter((m) => m.isActive);
  const pendingInvites = (invitesQuery.data ?? []).filter(
    (i) => !i.acceptedAt && new Date(i.expiresAt) > new Date(),
  );

  const inviteLink = (token: string) => `${window.location.origin}/invite/${token}`;

  const copyLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(inviteLink(token));
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "56rem" }}>
      <header>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: "1.75rem", fontWeight: 400, margin: 0, color: colors.text }}>
          Team
        </h2>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.9375rem", color: colors.textMuted }}>
          Invite managers and staff to collaborate on your venue.
        </p>
      </header>

      <section
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <header style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: "1.125rem", fontWeight: 500 }}>
            Invite someone
          </h3>
        </header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) inviteMutation.mutate({ email: email.trim().toLowerCase(), role });
          }}
          style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "0.75rem", alignItems: "end" }}
        >
          <div>
            <Label>Email address</Label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@venue.com"
              style={inputStyle}
            />
          </div>
          <div>
            <Label>Role</Label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} style={inputStyle}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">Staff</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={inviteMutation.isPending || !email.trim()}
            style={{
              padding: "0.625rem 1rem",
              background: colors.accent,
              color: "#0d0d0d",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              opacity: inviteMutation.isPending || !email.trim() ? 0.5 : 1,
            }}
          >
            <UserPlus size={14} strokeWidth={2.25} />
            {inviteMutation.isPending ? "Inviting…" : "Send invite"}
          </button>
        </form>

        {inviteMutation.error && (
          <div
            style={{
              margin: "0 1.25rem 1.25rem",
              padding: "0.625rem 0.75rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "4px",
              color: colors.danger,
              fontSize: "0.8125rem",
            }}
          >
            {inviteMutation.error.message}
          </div>
        )}

        {lastToken && (
          <div
            style={{
              margin: "0 1.25rem 1.25rem",
              padding: "0.75rem 1rem",
              background: "rgba(201,168,106,0.08)",
              border: `1px solid rgba(201,168,106,0.3)`,
              borderRadius: "6px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Invite created — copy and send the link
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <code
                style={{
                  flex: 1,
                  padding: "0.5rem 0.75rem",
                  background: "white",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
                }}
              >
                {inviteLink(lastToken)}
              </code>
              <button
                onClick={() => copyLink(lastToken)}
                style={{
                  padding: "0.5rem 0.625rem",
                  background: "white",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: colors.text,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {copiedToken === lastToken ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
                {copiedToken === lastToken ? "Copied" : "Copy"}
              </button>
            </div>
            <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "0.5rem" }}>
              Link expires in 7 days. Send it via your own email or messaging tool.
            </div>
          </div>
        )}
      </section>

      <section
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <header style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: "1.125rem", fontWeight: 500 }}>
            Team members
          </h3>
        </header>
        {members.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: colors.textDim, fontSize: "0.875rem" }}>
            No team members yet.
          </div>
        ) : (
          members.map((m) => {
            const isSelf = m.id === currentUser?.id;
            return (
              <div
                key={m.id}
                style={{
                  padding: "0.875rem 1.25rem",
                  borderBottom: `1px solid ${colors.border}`,
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: colors.text }}>
                    {m.firstName} {m.lastName}
                    {isSelf && <span style={{ color: colors.textMuted, fontSize: "0.75rem", marginLeft: "0.5rem" }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: colors.textMuted }}>{m.email}</div>
                </div>
                <select
                  value={m.role}
                  disabled={isSelf && currentUser?.role !== "admin"}
                  onChange={(e) => roleMutation.mutate({ userId: m.id, role: e.target.value as any })}
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
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">Staff</option>
                </select>
                <button
                  onClick={() => {
                    if (isSelf) return;
                    if (confirm(`Remove ${m.firstName} ${m.lastName} from the team?`)) {
                      removeMutation.mutate({ userId: m.id });
                    }
                  }}
                  disabled={isSelf}
                  style={{
                    padding: "0.375rem 0.625rem",
                    background: "transparent",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "4px",
                    color: isSelf ? "#cfcfc8" : colors.danger,
                    cursor: isSelf ? "not-allowed" : "pointer",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </section>

      <section
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <header style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: "1.125rem", fontWeight: 500 }}>
            Pending invites
          </h3>
        </header>
        {pendingInvites.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: colors.textDim, fontSize: "0.875rem" }}>
            No pending invites.
          </div>
        ) : (
          pendingInvites.map((inv) => (
            <div
              key={inv.id}
              style={{
                padding: "0.875rem 1.25rem",
                borderBottom: `1px solid ${colors.border}`,
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "0.9375rem", color: colors.text }}>{inv.email}</div>
                <div style={{ fontSize: "0.75rem", color: colors.textMuted }}>
                  Expires {new Date(inv.expiresAt).toLocaleDateString()} · {ROLE_LABEL[inv.role] ?? inv.role}
                </div>
              </div>
              <button
                onClick={() => copyLink(inv.token)}
                style={{
                  padding: "0.375rem 0.625rem",
                  background: "transparent",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: colors.text,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                {copiedToken === inv.token ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
                {copiedToken === inv.token ? "Copied" : "Copy link"}
              </button>
              <button
                onClick={() => cancelInviteMutation.mutate({ id: inv.id })}
                style={{
                  padding: "0.375rem 0.5rem",
                  background: "transparent",
                  border: "none",
                  color: colors.danger,
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <X size={12} /> Cancel
              </button>
              <span />
            </div>
          ))
        )}
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  fontFamily: '"Inter", sans-serif',
  fontSize: "0.875rem",
  color: colors.text,
  background: "white",
  border: `1px solid ${colors.border}`,
  borderRadius: "4px",
  boxSizing: "border-box",
  outline: "none",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: colors.textMuted,
        marginBottom: "0.375rem",
      }}
    >
      {children}
    </label>
  );
}
