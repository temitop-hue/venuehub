import React, { useState } from "react";
import type { ContactFormBlockData } from "@venuehub/shared";
import { trpc } from "../../trpc";
import { useParams } from "react-router-dom";
import { section, container, eyebrow, heading, subheading, divider, pillButton } from "../primitives";

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.9375rem",
  color: "var(--color-primary)",
  background: "white",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "var(--radius)",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "0.375rem",
  color: "var(--color-primary)",
  opacity: 0.7,
};

export function ContactFormBlock(props: ContactFormBlockData) {
  const { slug } = useParams<{ slug: string }>();
  const mutation = trpc.publicSite.submitContactForm.useMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    budget: "",
    message: "",
    honeypot: "",
  });

  const isDark = props.background === "primary";
  const bg = isDark ? "var(--color-primary)" : "var(--color-secondary)";
  const textColor = isDark ? "var(--color-secondary)" : "var(--color-primary)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    mutation.mutate({
      slug,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      eventType: form.eventType.trim() || undefined,
      eventDate: form.eventDate || undefined,
      guestCount: form.guestCount ? parseInt(form.guestCount, 10) : undefined,
      budget: form.budget ? parseInt(form.budget, 10) : undefined,
      message: form.message.trim() || undefined,
      honeypot: form.honeypot,
    });
  };

  return (
    <section id="contact" style={{ background: bg, color: textColor, ...section("lg") }}>
      <div style={{ ...container("narrow") }}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          {props.eyebrow && (
            <div style={{ ...eyebrow, color: "var(--color-accent)" }}>{props.eyebrow}</div>
          )}
          {props.heading && (
            <h2 style={{ ...heading, color: textColor }}>{props.heading}</h2>
          )}
          {props.heading && <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />}
          {props.subheading && (
            <p
              style={{
                ...subheading,
                color: textColor,
                opacity: isDark ? 0.75 : 0.7,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {props.subheading}
            </p>
          )}
        </header>

        {mutation.isSuccess ? (
          <div
            style={{
              padding: "3rem 2rem",
              textAlign: "center",
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ fontSize: "2rem", color: "var(--color-accent)", marginBottom: "0.75rem" }}>✦</div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: textColor,
              }}
            >
              {props.successMessage || "Thanks — we'll be in touch soon."}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem" }}>
              <Field label="Name *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputBase}
                />
              </Field>
              <Field label="Email *">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputBase}
                />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem" }}>
              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputBase}
                />
              </Field>
              <Field label="Event type">
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  style={inputBase}
                >
                  <option value="">Select…</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Fundraiser</option>
                  <option>Other</option>
                </select>
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))", gap: "1rem" }}>
              <Field label="Event date">
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  style={inputBase}
                />
              </Field>
              <Field label="Guest count">
                <input
                  type="number"
                  min={0}
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  style={inputBase}
                />
              </Field>
              <Field label="Budget (USD)">
                <input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  style={inputBase}
                />
              </Field>
            </div>

            <Field label="Tell us about your event">
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputBase, resize: "vertical", lineHeight: 1.5 }}
              />
            </Field>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
              style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              aria-hidden="true"
            />

            {mutation.isError && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(220,38,38,0.1)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  borderRadius: "var(--radius)",
                  color: "#fca5a5",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                }}
              >
                {mutation.error?.message ?? "Something went wrong. Please try again."}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={mutation.isPending}
                style={{
                  ...pillButton("solid"),
                  opacity: mutation.isPending ? 0.6 : 1,
                  cursor: mutation.isPending ? "not-allowed" : "pointer",
                }}
              >
                {mutation.isPending ? "Sending…" : props.submitLabel || "Send Inquiry"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
