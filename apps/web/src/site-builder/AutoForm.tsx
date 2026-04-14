import React from "react";
import type { FieldDef } from "@venuehub/shared";
import { MediaUploadField } from "./MediaUploadField";

const colors = {
  border: "#e8e8e4",
  borderFocus: "#c9a86a",
  text: "#17171a",
  textMuted: "#6e6e76",
  bg: "#ffffff",
  bgSubtle: "#fafaf5",
};

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.625rem",
  fontSize: "0.875rem",
  fontFamily: '"Inter", sans-serif',
  color: colors.text,
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: "4px",
  boxSizing: "border-box",
  outline: "none",
};

export interface AutoFormProps {
  fields: FieldDef[];
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  jsonError?: string | null;
}

export function AutoForm({ fields, values, onChange, jsonError }: AutoFormProps) {
  const set = (name: string, value: unknown) => onChange({ ...values, [name]: value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {fields.map((field) => {
        const current = values[field.name];
        const id = `f-${field.name}`;
        return (
          <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label
              htmlFor={id}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: colors.textMuted,
                textTransform: "uppercase",
              }}
            >
              {field.label}
            </label>
            {field.description && (
              <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "-0.125rem" }}>
                {field.description}
              </div>
            )}
            <FieldControl id={id} field={field} value={current} onChange={(v) => set(field.name, v)} />
            {field.type.kind === "json" && jsonError && (
              <div style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{jsonError}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldControl({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const t = field.type;
  const stringValue = typeof value === "string" ? value : value == null ? "" : String(value);

  switch (t.kind) {
    case "text":
    case "url":
      return (
        <input
          id={id}
          type={t.kind === "url" ? "url" : "text"}
          value={stringValue}
          placeholder={t.placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputBase}
        />
      );
    case "textarea":
      return (
        <textarea
          id={id}
          value={stringValue}
          placeholder={t.placeholder}
          rows={t.rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputBase, fontFamily: inputBase.fontFamily, resize: "vertical", lineHeight: 1.5 }}
        />
      );
    case "number":
      return (
        <input
          id={id}
          type="number"
          value={typeof value === "number" ? value : stringValue}
          min={t.min}
          max={t.max}
          step={t.step ?? 1}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? undefined : Number(v));
          }}
          style={inputBase}
        />
      );
    case "boolean":
      return (
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>Enabled</span>
        </label>
      );
    case "select":
      return (
        <select
          id={id}
          value={stringValue}
          onChange={(e) => {
            const raw = e.target.value;
            const numeric = Number(raw);
            onChange(
              field.name === "columns" || !Number.isNaN(numeric)
                ? !Number.isNaN(numeric) && String(numeric) === raw
                  ? numeric
                  : raw
                : raw,
            );
          }}
          style={inputBase}
        >
          {t.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "media":
      return (
        <MediaUploadField
          value={value}
          onChange={(v) => onChange(v)}
          accept={t.accept}
        />
      );
    case "json": {
      const pretty = stringifyForEditor(value);
      return (
        <textarea
          id={id}
          value={pretty}
          placeholder={t.placeholder}
          rows={10}
          onChange={(e) => {
            const text = e.target.value;
            try {
              const parsed = JSON.parse(text);
              onChange({ __json: parsed, __raw: text });
            } catch {
              onChange({ __json: undefined, __raw: text });
            }
          }}
          style={{
            ...inputBase,
            fontFamily: '"SF Mono", Menlo, Consolas, monospace',
            fontSize: "0.8125rem",
            resize: "vertical",
          }}
        />
      );
    }
  }
}

function stringifyForEditor(value: unknown): string {
  if (value && typeof value === "object" && "__raw" in (value as object)) {
    return String((value as { __raw: string }).__raw);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? "");
  }
}

export function normalizeJsonFields(
  fields: FieldDef[],
  values: Record<string, unknown>,
): { values: Record<string, unknown>; jsonError: string | null } {
  const out: Record<string, unknown> = { ...values };
  let jsonError: string | null = null;
  for (const f of fields) {
    if (f.type.kind !== "json") continue;
    const v = out[f.name];
    if (v && typeof v === "object" && "__raw" in (v as object)) {
      const wrapped = v as { __raw: string; __json?: unknown };
      if (wrapped.__json === undefined) {
        jsonError = `Invalid JSON in "${f.label}"`;
        out[f.name] = undefined;
      } else {
        out[f.name] = wrapped.__json;
      }
    }
  }
  return { values: out, jsonError };
}
