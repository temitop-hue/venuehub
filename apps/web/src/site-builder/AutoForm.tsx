import React, { useState } from "react";
import type { FieldDef } from "@venuehub/shared";
import { MediaUploadField } from "./MediaUploadField";
import { Plus, Trash2, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";

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
    case "arrayOfStrings":
      return (
        <ArrayOfStrings
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
          itemLabel={t.itemLabel ?? "Item"}
          placeholder={t.placeholder}
        />
      );
    case "arrayOfObjects":
      return (
        <ArrayOfObjects
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
          itemLabel={t.itemLabel}
          fields={t.fields}
          titleField={t.titleField}
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

// ---------- Array editors ----------

const repeaterColors = {
  border: "#e8e8e4",
  borderActive: "rgba(201,168,106,0.35)",
  bg: "#fafaf5",
  bgHover: "#f4f4ef",
  muted: "#6e6e76",
  dim: "#9b9ba1",
  text: "#17171a",
  accent: "#c9a86a",
  danger: "#b91c1c",
};

function repeaterFrame(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0.5rem",
    background: repeaterColors.bg,
    border: `1px solid ${repeaterColors.border}`,
    borderRadius: "6px",
  };
}

function itemFrame(open: boolean): React.CSSProperties {
  return {
    background: "white",
    border: `1px solid ${open ? repeaterColors.borderActive : repeaterColors.border}`,
    borderRadius: "4px",
    overflow: "hidden",
  };
}

const itemHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.8125rem",
  color: repeaterColors.text,
};

const iconBtn: React.CSSProperties = {
  width: "1.5rem",
  height: "1.5rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  color: repeaterColors.muted,
  cursor: "pointer",
  borderRadius: "3px",
};

const addBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.375rem",
  padding: "0.5rem 0.75rem",
  background: repeaterColors.accent,
  color: "#0d0d0d",
  border: "none",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  alignSelf: "flex-start",
};

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ArrayOfStrings({
  value,
  onChange,
  itemLabel,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  itemLabel: string;
  placeholder?: string;
}) {
  return (
    <div style={repeaterFrame()}>
      {value.length === 0 && (
        <div
          style={{
            padding: "0.75rem",
            textAlign: "center",
            color: repeaterColors.dim,
            fontSize: "0.8125rem",
          }}
        >
          No {itemLabel.toLowerCase()}s yet.
        </div>
      )}
      {value.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <input
            type="text"
            value={v}
            placeholder={placeholder}
            onChange={(e) => {
              const next = value.slice();
              next[i] = e.target.value;
              onChange(next);
            }}
            style={{
              flex: 1,
              padding: "0.5rem 0.625rem",
              fontSize: "0.875rem",
              fontFamily: '"Inter", sans-serif',
              color: repeaterColors.text,
              background: "white",
              border: `1px solid ${repeaterColors.border}`,
              borderRadius: "4px",
              outline: "none",
            }}
          />
          <button
            style={iconBtn}
            title="Move up"
            onClick={() => onChange(move(value, i, i - 1))}
            disabled={i === 0}
          >
            <ArrowUp size={13} strokeWidth={2} />
          </button>
          <button
            style={iconBtn}
            title="Move down"
            onClick={() => onChange(move(value, i, i + 1))}
            disabled={i === value.length - 1}
          >
            <ArrowDown size={13} strokeWidth={2} />
          </button>
          <button
            style={{ ...iconBtn, color: repeaterColors.danger }}
            title={`Remove ${itemLabel.toLowerCase()}`}
            onClick={() => {
              const next = value.slice();
              next.splice(i, 1);
              onChange(next);
            }}
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      ))}
      <button type="button" style={addBtn} onClick={() => onChange([...value, ""])}>
        <Plus size={12} strokeWidth={2.5} /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

function ArrayOfObjects({
  value,
  onChange,
  itemLabel,
  fields,
  titleField,
}: {
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  itemLabel: string;
  fields: FieldDef[];
  titleField?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(value.length === 0 ? null : 0);

  const addItem = () => {
    const blank: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type.kind === "boolean") blank[f.name] = false;
      else if (f.type.kind === "arrayOfStrings" || f.type.kind === "arrayOfObjects") blank[f.name] = [];
      else blank[f.name] = "";
    }
    const next = [...value, blank];
    onChange(next);
    setOpenIndex(next.length - 1);
  };

  return (
    <div style={repeaterFrame()}>
      {value.length === 0 && (
        <div
          style={{
            padding: "0.75rem",
            textAlign: "center",
            color: repeaterColors.dim,
            fontSize: "0.8125rem",
          }}
        >
          No {itemLabel.toLowerCase()}s yet.
        </div>
      )}
      {value.map((item, i) => {
        const isOpen = openIndex === i;
        const preview =
          (titleField && typeof item[titleField] === "string" && (item[titleField] as string)) ||
          `${itemLabel} ${i + 1}`;
        return (
          <div key={i} style={itemFrame(isOpen)}>
            <div style={itemHeader}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{ ...iconBtn, width: "1.25rem" }}
                title={isOpen ? "Collapse" : "Expand"}
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {preview}
              </span>
              <button
                style={iconBtn}
                title="Move up"
                onClick={() => onChange(move(value, i, i - 1))}
                disabled={i === 0}
              >
                <ArrowUp size={13} strokeWidth={2} />
              </button>
              <button
                style={iconBtn}
                title="Move down"
                onClick={() => onChange(move(value, i, i + 1))}
                disabled={i === value.length - 1}
              >
                <ArrowDown size={13} strokeWidth={2} />
              </button>
              <button
                style={{ ...iconBtn, color: repeaterColors.danger }}
                title={`Remove ${itemLabel.toLowerCase()}`}
                onClick={() => {
                  const next = value.slice();
                  next.splice(i, 1);
                  onChange(next);
                  if (openIndex === i) setOpenIndex(null);
                }}
              >
                <Trash2 size={13} strokeWidth={2} />
              </button>
            </div>
            {isOpen && (
              <div style={{ padding: "0.75rem 1rem 1rem", borderTop: `1px solid ${repeaterColors.border}` }}>
                <AutoForm
                  fields={fields}
                  values={item}
                  onChange={(next) => {
                    const newArr = value.slice();
                    newArr[i] = next;
                    onChange(newArr);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      <button type="button" style={addBtn} onClick={addItem}>
        <Plus size={12} strokeWidth={2.5} /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
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
