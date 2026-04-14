import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { OnboardingLayout } from "./OnboardingLayout";
import { colors, fonts, pillButton } from "../marketing/styles";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem 1rem",
  background: colors.bgElevated,
  border: `1px solid ${colors.border}`,
  borderRadius: "4px",
  color: colors.text,
  fontFamily: fonts.body,
  fontSize: "1rem",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: fonts.body,
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: colors.textMuted,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "0.5rem",
};

export function BasicsStep() {
  const navigate = useNavigate();
  const statusQuery = trpc.onboarding.status.useQuery();

  const [slug, setSlug] = useState("");
  const [primaryEventType, setPrimaryEventType] = useState("Weddings");
  const [capacity, setCapacity] = useState("200");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const venueName = statusQuery.data?.name ?? "";

  const derivedSlug = useMemo(() => slugify(venueName), [venueName]);
  const effectiveSlug = slug || derivedSlug;

  const slugCheck = trpc.onboarding.checkSlug.useQuery(
    { slug: effectiveSlug },
    { enabled: effectiveSlug.length >= 3 },
  );

  const updateMutation = trpc.onboarding.updateBasics.useMutation({
    onSuccess: () => {
      navigate("/onboarding/style", {
        state: { primaryEventType, capacity: parseInt(capacity) || 200, city, state },
      });
    },
  });

  const canSubmit =
    effectiveSlug.length >= 3 &&
    slugCheck.data?.available &&
    primaryEventType.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    updateMutation.mutate({
      slug: effectiveSlug,
      primaryEventType: primaryEventType.trim(),
      capacity: parseInt(capacity) || 200,
      city: city.trim(),
      state: state.trim(),
    });
  };

  const slugMessage = !effectiveSlug
    ? null
    : slugCheck.isLoading
      ? "Checking…"
      : slugCheck.data?.available
        ? "Available"
        : slugCheck.data?.reason === "invalid"
          ? "Use 3–60 lowercase letters, numbers, or hyphens."
          : slugCheck.data?.reason === "reserved"
            ? "Reserved — try another."
            : "Taken — try another.";
  const slugOk = Boolean(slugCheck.data?.available);

  return (
    <OnboardingLayout step={1}>
      <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: "0.75rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: colors.accent,
            marginBottom: "1rem",
          }}
        >
          Step 1 of 4
        </div>
        <h1
          style={{
            fontFamily: fonts.heading,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 400,
            color: colors.text,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Tell us about {venueName || "your venue"}.
        </h1>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: "1rem",
            color: colors.textMuted,
            marginTop: "1rem",
            lineHeight: 1.6,
          }}
        >
          A few details so we can set up your site. You can change anything later.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "2.5rem", display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>Your site URL</label>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                background: colors.bgElevated,
                border: `1px solid ${slugOk ? "rgba(201,168,106,0.4)" : colors.border}`,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  padding: "0.875rem 0.875rem 0.875rem 1rem",
                  color: colors.textDim,
                  fontFamily: fonts.body,
                  fontSize: "0.9375rem",
                  borderRight: `1px solid ${colors.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                venuehub.app/v/
              </span>
              <input
                type="text"
                value={slug || derivedSlug}
                placeholder={derivedSlug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugEdited(true);
                }}
                style={{
                  flex: 1,
                  padding: "0.875rem 1rem",
                  background: "transparent",
                  border: "none",
                  color: colors.text,
                  fontFamily: fonts.body,
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
            </div>
            {slugMessage && (
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: "0.8125rem",
                  color: slugOk ? colors.accent : colors.textMuted,
                  margin: "0.5rem 0 0",
                }}
              >
                {slugMessage}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Primary event type</label>
            <select
              value={primaryEventType}
              onChange={(e) => setPrimaryEventType(e.target.value)}
              style={inputStyle}
            >
              <option>Weddings</option>
              <option>Corporate events</option>
              <option>Social gatherings</option>
              <option>Fundraisers & galas</option>
              <option>All of the above</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Max guest capacity</label>
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Burtonsville"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="MD"
                style={inputStyle}
              />
            </div>
          </div>

          {updateMutation.error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.3)",
                borderRadius: "4px",
                color: "#fca5a5",
                fontFamily: fonts.body,
                fontSize: "0.875rem",
              }}
            >
              {updateMutation.error.message}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button
              type="submit"
              disabled={!canSubmit || updateMutation.isPending}
              style={{
                ...pillButton("solid"),
                opacity: !canSubmit || updateMutation.isPending ? 0.5 : 1,
                cursor: !canSubmit || updateMutation.isPending ? "not-allowed" : "pointer",
              }}
            >
              {updateMutation.isPending ? "Saving…" : "Continue →"}
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
