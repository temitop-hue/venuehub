import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";

const colors = {
  bg: "#0a0a0a",
  card: "#141414",
  border: "#262626",
  text: "#f5f5f1",
  textMuted: "#8a8a85",
  accent: "#c9a86a",
  danger: "#b91c1c",
};

export function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const inviteQuery = trpc.team.getInvite.useQuery(
    { token: token ?? "" },
    { enabled: Boolean(token), retry: false },
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const acceptMutation = trpc.team.acceptInvite.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user as any);
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    acceptMutation.mutate({
      token,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password,
    });
  };

  if (inviteQuery.isLoading) {
    return <FullPage>Loading…</FullPage>;
  }

  if (inviteQuery.error) {
    return (
      <FullPage>
        <div style={{ textAlign: "center", maxWidth: "28rem" }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "2rem", fontWeight: 400, margin: 0, color: colors.text }}>
            Invite unavailable
          </h1>
          <p style={{ color: colors.textMuted, marginTop: "1rem", lineHeight: 1.6 }}>
            {inviteQuery.error.message}
          </p>
          <a
            href="/login"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.625rem 1.25rem",
              background: colors.accent,
              color: "#0d0d0d",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Sign in instead →
          </a>
        </div>
      </FullPage>
    );
  }

  return (
    <FullPage>
      <div
        style={{
          width: "100%",
          maxWidth: "26rem",
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.24em", textTransform: "uppercase", color: colors.accent, marginBottom: "0.75rem" }}>
          You've been invited
        </div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "1.75rem", fontWeight: 400, margin: 0, color: colors.text, lineHeight: 1.2 }}>
          Join {inviteQuery.data?.tenantName}
        </h1>
        <p style={{ color: colors.textMuted, margin: "1rem 0 0", fontSize: "0.9375rem", lineHeight: 1.6 }}>
          You're being added as <strong style={{ color: colors.text, textTransform: "capitalize" }}>{inviteQuery.data?.role}</strong>.
          Set your name and password to get started.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <Field label="Email">
            <input type="email" disabled value={inviteQuery.data?.email ?? ""} style={{ ...inputStyle, opacity: 0.6 }} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="First name">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Last name">
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label="Password (6+ characters)">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </Field>

          {acceptMutation.error && (
            <div
              style={{
                padding: "0.625rem 0.75rem",
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.3)",
                borderRadius: "4px",
                color: "#fca5a5",
                fontSize: "0.8125rem",
              }}
            >
              {acceptMutation.error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={acceptMutation.isPending}
            style={{
              padding: "0.75rem 1rem",
              background: colors.accent,
              color: "#0d0d0d",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "0.25rem",
              opacity: acceptMutation.isPending ? 0.5 : 1,
            }}
          >
            {acceptMutation.isPending ? "Creating account…" : "Accept invite"}
          </button>
        </form>
      </div>
    </FullPage>
  );
}

function FullPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: colors.bg,
        color: colors.text,
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
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
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  fontFamily: '"Inter", sans-serif',
  fontSize: "0.9375rem",
  color: colors.text,
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: "4px",
  boxSizing: "border-box",
  outline: "none",
};
