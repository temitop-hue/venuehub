import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Check,
} from "lucide-react";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
import { BLOCK_FIELDS, blockRegistry, type BlockType } from "@venuehub/shared";
import { AutoForm, normalizeJsonFields } from "./AutoForm";

const colors = {
  bg: "#f6f6f2",
  card: "#ffffff",
  cardSubtle: "#fafaf5",
  border: "#e8e8e4",
  borderStrong: "#dcdcd4",
  text: "#17171a",
  textMuted: "#6e6e76",
  textDim: "#9b9ba1",
  accent: "#c9a86a",
  accentSoft: "rgba(201,168,106,0.08)",
};

type BlockRow = {
  id: number;
  blockType: string;
  blockData: unknown;
  displayOrder: number;
  isVisible: boolean;
  isPublished: boolean;
};

export function SiteBuilder() {
  const { user } = useAuthStore();
  const slug = user?.tenant?.slug ?? "";
  const pageQuery = trpc.siteAdmin.getHomePage.useQuery();
  const utils = trpc.useContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const blocks = pageQuery.data?.blocks ?? ([] as unknown as BlockRow[]);
  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setDraft(selected.blockData as Record<string, unknown>);
    setDirty(false);
    setJsonError(null);
    setErrorMsg(null);
  }, [selectedId, pageQuery.dataUpdatedAt]);

  useEffect(() => {
    if (selectedId == null && blocks.length > 0) {
      setSelectedId(blocks[0].id);
    }
  }, [blocks, selectedId]);

  const reloadPreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const src = iframe.src.split("?")[0] + `?t=${Date.now()}`;
    iframe.src = src;
  };

  const invalidateAndReload = async () => {
    await utils.siteAdmin.getHomePage.invalidate();
    reloadPreview();
  };

  const updateMutation = trpc.siteAdmin.updateBlock.useMutation({
    onMutate: () => {
      setSaveStatus("saving");
      setErrorMsg(null);
    },
    onSuccess: async () => {
      setSaveStatus("saved");
      setDirty(false);
      await invalidateAndReload();
      setTimeout(() => setSaveStatus("idle"), 1500);
    },
    onError: (err) => {
      setSaveStatus("error");
      setErrorMsg(err.message);
    },
  });

  const addMutation = trpc.siteAdmin.addBlock.useMutation({
    onSuccess: async (res) => {
      await invalidateAndReload();
      if (res?.id) setSelectedId(res.id);
    },
  });

  const deleteMutation = trpc.siteAdmin.deleteBlock.useMutation({
    onSuccess: async () => {
      setSelectedId(null);
      await invalidateAndReload();
    },
  });

  const reorderMutation = trpc.siteAdmin.reorderBlocks.useMutation({
    onSuccess: invalidateAndReload,
  });

  const toggleVisMutation = trpc.siteAdmin.toggleVisibility.useMutation({
    onSuccess: invalidateAndReload,
  });

  const handleSave = () => {
    if (!selected || !draft) return;
    const fields = BLOCK_FIELDS[selected.blockType] ?? [];
    const { values, jsonError: err } = normalizeJsonFields(fields, draft);
    if (err) {
      setJsonError(err);
      setSaveStatus("error");
      setErrorMsg(err);
      return;
    }
    setJsonError(null);
    updateMutation.mutate({ id: selected.id, data: values });
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const next = blocks.slice();
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    reorderMutation.mutate({ orderedIds: next.map((b) => b.id) });
  };

  const fields = selected ? BLOCK_FIELDS[selected.blockType] ?? [] : [];
  const availableTypes = Object.keys(blockRegistry) as BlockType[];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr) 340px",
        height: "calc(100vh - 4rem)",
        margin: "-1.5rem -1.5rem -1.5rem -1.5rem",
        background: colors.bg,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <aside
        style={{
          borderRight: `1px solid ${colors.border}`,
          background: colors.card,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <header style={{ padding: "1rem 1rem 0.75rem", borderBottom: `1px solid ${colors.border}` }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.textMuted,
            }}
          >
            Blocks
          </div>
          <div style={{ fontSize: "0.75rem", color: colors.textDim, marginTop: "0.25rem" }}>
            {blocks.length} on home page
          </div>
        </header>
        <div style={{ padding: "0.5rem", overflowY: "auto", flex: 1 }}>
          {blocks.map((b, i) => {
            const label = blockRegistry[b.blockType as BlockType]?.label ?? b.blockType;
            const isSelected = b.id === selectedId;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                style={{
                  padding: "0.625rem 0.75rem",
                  borderRadius: "6px",
                  background: isSelected ? colors.accentSoft : "transparent",
                  border: `1px solid ${isSelected ? "rgba(201,168,106,0.35)" : "transparent"}`,
                  marginBottom: "0.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500, color: colors.text }}>{label}</div>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: colors.textDim,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginTop: "0.125rem",
                    }}
                  >
                    #{i + 1} {b.isVisible ? "" : "· hidden"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.125rem" }} onClick={(e) => e.stopPropagation()}>
                  <IconBtn title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp size={13} />
                  </IconBtn>
                  <IconBtn title="Move down" onClick={() => move(i, 1)} disabled={i === blocks.length - 1}>
                    <ArrowDown size={13} />
                  </IconBtn>
                  <IconBtn
                    title={b.isVisible ? "Hide" : "Show"}
                    onClick={() => toggleVisMutation.mutate({ id: b.id })}
                  >
                    {b.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </IconBtn>
                  <IconBtn
                    title="Delete"
                    onClick={() => {
                      if (confirm(`Delete ${label}?`)) deleteMutation.mutate({ id: b.id });
                    }}
                  >
                    <Trash2 size={13} color="#b91c1c" />
                  </IconBtn>
                </div>
              </div>
            );
          })}
        </div>
        <footer style={{ padding: "0.75rem", borderTop: `1px solid ${colors.border}` }}>
          <details>
            <summary
              style={{
                padding: "0.5rem 0.75rem",
                background: colors.accent,
                color: "#0d0d0d",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem",
                listStyle: "none",
              }}
            >
              <Plus size={14} strokeWidth={2.25} />
              Add block
            </summary>
            <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {availableTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => addMutation.mutate({ blockType: t })}
                  disabled={addMutation.isPending}
                  style={{
                    padding: "0.5rem 0.75rem",
                    textAlign: "left",
                    background: "transparent",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: colors.text,
                  }}
                >
                  {blockRegistry[t].label}
                </button>
              ))}
            </div>
          </details>
        </footer>
      </aside>

      <section style={{ position: "relative", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div
          style={{
            padding: "0.75rem 1rem",
            borderBottom: `1px solid ${colors.border}`,
            background: colors.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: colors.textMuted,
              }}
            >
              Live preview
            </span>
            {slug && (
              <span style={{ fontSize: "0.75rem", color: colors.textDim }}>
                venuehub.app/v/{slug}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={reloadPreview}
              style={{
                fontSize: "0.75rem",
                padding: "0.375rem 0.75rem",
                background: "transparent",
                border: `1px solid ${colors.border}`,
                borderRadius: "4px",
                cursor: "pointer",
                color: colors.text,
                fontWeight: 500,
              }}
            >
              Refresh
            </button>
            {slug && (
              <a
                href={`/v/${slug}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.375rem 0.75rem",
                  background: colors.accent,
                  border: "none",
                  borderRadius: "4px",
                  color: "#0d0d0d",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                Open live <ExternalLink size={12} strokeWidth={2.25} />
              </a>
            )}
          </div>
        </div>
        {slug ? (
          <iframe
            ref={iframeRef}
            src={`/v/${slug}`}
            title="Site preview"
            style={{ flex: 1, width: "100%", border: "none", background: "#fff" }}
          />
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textMuted }}>
            Finish onboarding to see your site preview.
          </div>
        )}
      </section>

      <aside
        style={{
          borderLeft: `1px solid ${colors.border}`,
          background: colors.card,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {selected ? (
          <>
            <header
              style={{
                padding: "1rem",
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: colors.textMuted,
                    fontWeight: 600,
                  }}
                >
                  Editing
                </div>
                <div
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: "1.125rem",
                    color: colors.text,
                    marginTop: "0.125rem",
                  }}
                >
                  {blockRegistry[selected.blockType as BlockType]?.label ?? selected.blockType}
                </div>
              </div>
              <SaveBadge status={saveStatus} />
            </header>
            <div style={{ padding: "1rem", overflowY: "auto", flex: 1 }}>
              {draft && (
                <AutoForm
                  fields={fields}
                  values={draft}
                  jsonError={jsonError}
                  onChange={(v) => {
                    setDraft(v);
                    setDirty(true);
                  }}
                />
              )}
              {errorMsg && saveStatus === "error" && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.625rem 0.75rem",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "4px",
                    color: "#b91c1c",
                    fontSize: "0.8125rem",
                  }}
                >
                  {errorMsg}
                </div>
              )}
            </div>
            <footer
              style={{
                padding: "0.75rem 1rem",
                borderTop: `1px solid ${colors.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={handleSave}
                disabled={!dirty || updateMutation.isPending}
                style={{
                  padding: "0.5rem 1rem",
                  background: dirty ? colors.accent : "#e8e8e4",
                  color: dirty ? "#0d0d0d" : colors.textMuted,
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: dirty ? "pointer" : "not-allowed",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <Save size={14} strokeWidth={2.25} />
                {updateMutation.isPending ? "Saving…" : dirty ? "Save changes" : "Saved"}
              </button>
            </footer>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              textAlign: "center",
              color: colors.textMuted,
              fontSize: "0.875rem",
            }}
          >
            Select a block on the left to edit its content.
          </div>
        )}
      </aside>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: "1.5rem",
        height: "1.5rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: disabled ? "#cfcfc8" : "#6e6e76",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "3px",
      }}
    >
      {children}
    </button>
  );
}

function SaveBadge({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "saving") {
    return (
      <span style={{ fontSize: "0.75rem", color: "#6e6e76" }}>Saving…</span>
    );
  }
  if (status === "saved") {
    return (
      <span
        style={{
          fontSize: "0.75rem",
          color: "#15803d",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <Check size={12} strokeWidth={2.5} /> Saved
      </span>
    );
  }
  if (status === "error") {
    return <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>Error</span>;
  }
  return null;
}
