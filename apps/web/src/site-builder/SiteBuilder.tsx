import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Check,
  Settings,
  Palette,
  X,
} from "lucide-react";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
import { BLOCK_FIELDS, blockRegistry, type BlockType } from "@venuehub/shared";
import { AutoForm, normalizeJsonFields } from "./AutoForm";
import { ThemeModal } from "./ThemeModal";

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
  danger: "#b91c1c",
};

type PageRow = {
  id: number;
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isPublished: boolean;
  displayOrder: number;
};

type BlockRow = {
  id: number;
  blockType: string;
  blockData: unknown;
  displayOrder: number;
  isVisible: boolean;
  isPublished: boolean;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

export function SiteBuilder() {
  const { user } = useAuthStore();
  const slug = user?.tenant?.slug ?? "";
  const utils = trpc.useContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const pagesQuery = trpc.siteAdmin.listPages.useQuery();
  const pageRows = (pagesQuery.data ?? []) as PageRow[];

  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  // Default to home page on first load
  useEffect(() => {
    if (selectedPageId == null && pageRows.length > 0) {
      const home = pageRows.find((p) => p.slug === "home") ?? pageRows[0];
      setSelectedPageId(home.id);
    }
  }, [pageRows, selectedPageId]);

  const pageQuery = trpc.siteAdmin.getPage.useQuery(
    { pageId: selectedPageId ?? 0 },
    { enabled: !!selectedPageId },
  );
  const currentPage = pageQuery.data?.page as PageRow | undefined;
  const blocks = (pageQuery.data?.blocks ?? []) as BlockRow[];
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  useEffect(() => {
    if (!selectedBlock) {
      setDraft(null);
      setDirty(false);
      return;
    }
    setDraft(selectedBlock.blockData as Record<string, unknown>);
    setDirty(false);
    setJsonError(null);
    setErrorMsg(null);
  }, [selectedBlockId, pageQuery.dataUpdatedAt]);

  // When page changes, auto-select first block
  useEffect(() => {
    if (selectedBlockId == null && blocks.length > 0) {
      setSelectedBlockId(blocks[0].id);
    } else if (selectedBlockId != null && !blocks.find((b) => b.id === selectedBlockId)) {
      setSelectedBlockId(blocks[0]?.id ?? null);
    }
  }, [blocks]);

  const reloadPreview = () => {
    const iframe = iframeRef.current;
    if (!iframe || !currentPage) return;
    const baseUrl = currentPage.slug === "home" ? `/v/${slug}` : `/v/${slug}/${currentPage.slug}`;
    iframe.src = `${baseUrl}?t=${Date.now()}`;
  };

  // Reload preview whenever the active page changes
  useEffect(() => {
    if (currentPage) reloadPreview();
  }, [currentPage?.id, currentPage?.slug]);

  const invalidateAndReload = async () => {
    await utils.siteAdmin.getPage.invalidate({ pageId: selectedPageId ?? 0 });
    await utils.siteAdmin.listPages.invalidate();
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

  const addBlockMutation = trpc.siteAdmin.addBlock.useMutation({
    onSuccess: async (res) => {
      await invalidateAndReload();
      if (res?.id) setSelectedBlockId(res.id);
    },
  });

  const deleteBlockMutation = trpc.siteAdmin.deleteBlock.useMutation({
    onSuccess: async () => {
      setSelectedBlockId(null);
      await invalidateAndReload();
    },
  });

  const reorderBlocksMutation = trpc.siteAdmin.reorderBlocks.useMutation({
    onSuccess: invalidateAndReload,
  });

  const toggleVisMutation = trpc.siteAdmin.toggleVisibility.useMutation({
    onSuccess: invalidateAndReload,
  });

  const createPageMutation = trpc.siteAdmin.createPage.useMutation({
    onSuccess: async (res) => {
      await utils.siteAdmin.listPages.invalidate();
      if (res?.id) {
        setSelectedPageId(res.id);
        setSelectedBlockId(null);
      }
      setShowAddPage(false);
    },
  });

  const updatePageMutation = trpc.siteAdmin.updatePage.useMutation({
    onSuccess: async () => {
      await utils.siteAdmin.listPages.invalidate();
      await utils.siteAdmin.getPage.invalidate({ pageId: selectedPageId ?? 0 });
      reloadPreview();
    },
  });

  const deletePageMutation = trpc.siteAdmin.deletePage.useMutation({
    onSuccess: async () => {
      await utils.siteAdmin.listPages.invalidate();
      const home = pageRows.find((p) => p.slug === "home");
      setSelectedPageId(home?.id ?? null);
      setShowPageSettings(false);
    },
  });

  const reorderPagesMutation = trpc.siteAdmin.reorderPages.useMutation({
    onSuccess: async () => {
      await utils.siteAdmin.listPages.invalidate();
      reloadPreview();
    },
  });

  const movePage = (pageId: number, delta: -1 | 1) => {
    const currentIndex = pageRows.findIndex((p) => p.id === pageId);
    const targetIndex = currentIndex + delta;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= pageRows.length) return;
    const next = pageRows.slice();
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);
    reorderPagesMutation.mutate({ orderedIds: next.map((p) => p.id) });
  };

  const handleSave = () => {
    if (!selectedBlock || !draft) return;
    const fields = BLOCK_FIELDS[selectedBlock.blockType] ?? [];
    const { values, jsonError: err } = normalizeJsonFields(fields, draft);
    if (err) {
      setJsonError(err);
      setSaveStatus("error");
      setErrorMsg(err);
      return;
    }
    setJsonError(null);
    updateMutation.mutate({ id: selectedBlock.id, data: values });
  };

  const moveBlock = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length || !selectedPageId) return;
    const next = blocks.slice();
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    reorderBlocksMutation.mutate({ pageId: selectedPageId, orderedIds: next.map((b) => b.id) });
  };

  const fields = selectedBlock ? BLOCK_FIELDS[selectedBlock.blockType] ?? [] : [];
  const availableTypes = Object.keys(blockRegistry) as BlockType[];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 4rem)",
        margin: "-1.5rem -1.5rem -1.5rem -1.5rem",
        background: colors.bg,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <PageTabStrip
        pages={pageRows}
        selectedPageId={selectedPageId}
        onSelect={(id) => {
          setSelectedPageId(id);
          setSelectedBlockId(null);
        }}
        onAddPage={() => setShowAddPage(true)}
        onPageSettings={() => setShowPageSettings(true)}
        onOpenTheme={() => setShowTheme(true)}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr) 340px",
          flex: 1,
          minHeight: 0,
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
              {blocks.length} on {currentPage?.title ?? "this page"}
            </div>
          </header>
          <div style={{ padding: "0.5rem", overflowY: "auto", flex: 1 }}>
            {blocks.map((b, i) => {
              const label = blockRegistry[b.blockType as BlockType]?.label ?? b.blockType;
              const isSelected = b.id === selectedBlockId;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBlockId(b.id)}
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
                    <IconBtn title="Move up" onClick={() => moveBlock(i, -1)} disabled={i === 0}>
                      <ArrowUp size={13} />
                    </IconBtn>
                    <IconBtn title="Move down" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}>
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
                        if (confirm(`Delete ${label}?`)) deleteBlockMutation.mutate({ id: b.id });
                      }}
                    >
                      <Trash2 size={13} color={colors.danger} />
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
                    onClick={() => selectedPageId && addBlockMutation.mutate({ pageId: selectedPageId, blockType: t })}
                    disabled={addBlockMutation.isPending}
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
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
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
              {slug && currentPage && (
                <span style={{ fontSize: "0.75rem", color: colors.textDim }}>
                  venuehub.app/v/{slug}{currentPage.slug !== "home" ? `/${currentPage.slug}` : ""}
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
              {slug && currentPage && (
                <a
                  href={currentPage.slug === "home" ? `/v/${slug}` : `/v/${slug}/${currentPage.slug}`}
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
          {slug && currentPage ? (
            <iframe
              ref={iframeRef}
              src={currentPage.slug === "home" ? `/v/${slug}` : `/v/${slug}/${currentPage.slug}`}
              title="Site preview"
              style={{ flex: 1, width: "100%", border: "none", background: "#fff" }}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.textMuted,
              }}
            >
              {pagesQuery.isLoading ? "Loading…" : "Finish onboarding to see your site preview."}
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
          {selectedBlock ? (
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
                    {blockRegistry[selectedBlock.blockType as BlockType]?.label ?? selectedBlock.blockType}
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
                      color: colors.danger,
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
              {blocks.length === 0
                ? "No blocks on this page yet — add one from the bottom-left."
                : "Select a block on the left to edit its content."}
            </div>
          )}
        </aside>
      </div>

      {showAddPage && (
        <AddPageModal
          onCancel={() => setShowAddPage(false)}
          onCreate={(slug, title, copyFromPageId) =>
            createPageMutation.mutate({ slug, title, copyFromPageId })
          }
          existingPages={pageRows}
          isPending={createPageMutation.isPending}
          error={createPageMutation.error?.message ?? null}
        />
      )}

      {showPageSettings && currentPage && (
        <PageSettingsModal
          page={currentPage}
          pageIndex={pageRows.findIndex((p) => p.id === currentPage.id)}
          totalPages={pageRows.length}
          onMoveLeft={() => movePage(currentPage.id, -1)}
          onMoveRight={() => movePage(currentPage.id, 1)}
          onClose={() => setShowPageSettings(false)}
          onSave={(updates) => updatePageMutation.mutate({ pageId: currentPage.id, ...updates })}
          onDelete={() => {
            if (confirm(`Delete the "${currentPage.title}" page? This can't be undone.`)) {
              deletePageMutation.mutate({ pageId: currentPage.id });
            }
          }}
          isSaving={updatePageMutation.isPending}
          isDeleting={deletePageMutation.isPending}
          saveError={updatePageMutation.error?.message ?? null}
        />
      )}

      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
    </div>
  );
}

function PageTabStrip({
  pages,
  selectedPageId,
  onSelect,
  onAddPage,
  onPageSettings,
  onOpenTheme,
}: {
  pages: PageRow[];
  selectedPageId: number | null;
  onSelect: (id: number) => void;
  onAddPage: () => void;
  onPageSettings: () => void;
  onOpenTheme: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        background: colors.card,
        borderBottom: `1px solid ${colors.border}`,
        padding: "0 0.75rem",
        gap: "0.25rem",
        overflowX: "auto",
        minHeight: "2.75rem",
      }}
    >
      {pages.map((p) => {
        const isActive = p.id === selectedPageId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{
              padding: "0.5rem 0.875rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${isActive ? colors.accent : "transparent"}`,
              color: isActive ? colors.text : colors.textMuted,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            {p.title}
            {!p.isPublished && (
              <span
                style={{
                  fontSize: "0.625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.textDim,
                  background: "#eee",
                  padding: "0.0625rem 0.375rem",
                  borderRadius: "3px",
                }}
              >
                Draft
              </span>
            )}
            {isActive && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onPageSettings();
                }}
                title="Page settings"
                style={{
                  marginLeft: "0.125rem",
                  width: "1.25rem",
                  height: "1.25rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "3px",
                  color: colors.textMuted,
                  cursor: "pointer",
                }}
              >
                <Settings size={12} strokeWidth={2} />
              </span>
            )}
          </button>
        );
      })}
      <button
        onClick={onAddPage}
        title="Add page"
        style={{
          padding: "0.5rem 0.75rem",
          background: "transparent",
          border: "none",
          color: colors.accent,
          cursor: "pointer",
          fontSize: "0.8125rem",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <Plus size={14} strokeWidth={2.25} /> New page
      </button>
      <div style={{ flex: 1 }} />
      <button
        onClick={onOpenTheme}
        title="Theme & branding"
        style={{
          padding: "0.5rem 0.75rem",
          background: "transparent",
          border: `1px solid ${colors.border}`,
          borderRadius: "4px",
          margin: "0.375rem 0.25rem 0.375rem 0",
          color: colors.text,
          cursor: "pointer",
          fontSize: "0.8125rem",
          fontWeight: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          whiteSpace: "nowrap",
        }}
      >
        <Palette size={14} strokeWidth={2} /> Theme
      </button>
    </div>
  );
}

function AddPageModal({
  onCancel,
  onCreate,
  existingPages,
  isPending,
  error,
}: {
  onCancel: () => void;
  onCreate: (slug: string, title: string, copyFromPageId?: number) => void;
  existingPages: PageRow[];
  isPending: boolean;
  error: string | null;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [copyFromPageId, setCopyFromPageId] = useState<number | "">("");

  const effectiveSlug = slugTouched || !title ? slug : slugify(title);
  const canCreate = title.trim().length > 0 && effectiveSlug.length > 0;

  return (
    <ModalShell title="Add a new page" onClose={onCancel}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Page name">
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Book a Tour"
            style={modalInput}
          />
        </Field>
        <Field label="URL slug">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <span style={{ padding: "0.5rem 0.75rem", color: colors.textMuted, fontSize: "0.8125rem", borderRight: `1px solid ${colors.border}` }}>
              /
            </span>
            <input
              type="text"
              value={effectiveSlug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              style={{ ...modalInput, border: "none" }}
              placeholder="book-a-tour"
            />
          </div>
        </Field>
        <Field label="Start from">
          <select
            value={copyFromPageId}
            onChange={(e) => setCopyFromPageId(e.target.value === "" ? "" : Number(e.target.value))}
            style={modalInput}
          >
            <option value="">Blank page</option>
            {existingPages.map((p) => (
              <option key={p.id} value={p.id}>
                Copy blocks from {p.title}
              </option>
            ))}
          </select>
        </Field>
        {error && (
          <div
            style={{
              padding: "0.625rem 0.75rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "4px",
              color: colors.danger,
              fontSize: "0.8125rem",
            }}
          >
            {error}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button onClick={onCancel} style={ghostBtn}>
            Cancel
          </button>
          <button
            onClick={() => onCreate(effectiveSlug, title.trim(), copyFromPageId === "" ? undefined : copyFromPageId)}
            disabled={!canCreate || isPending}
            style={{
              ...primaryBtn,
              opacity: !canCreate || isPending ? 0.5 : 1,
              cursor: !canCreate || isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "Creating…" : "Create page"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function PageSettingsModal({
  page,
  pageIndex,
  totalPages,
  onMoveLeft,
  onMoveRight,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  saveError,
}: {
  page: PageRow;
  pageIndex: number;
  totalPages: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onClose: () => void;
  onSave: (updates: { title?: string; slug?: string; metaTitle?: string; metaDescription?: string; isPublished?: boolean }) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  saveError: string | null;
}) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  const [isPublished, setIsPublished] = useState(page.isPublished);

  const isHome = page.slug === "home";

  return (
    <ModalShell title={`${page.title} — settings`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Page name">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={modalInput}
          />
        </Field>
        <Field label="URL slug">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              overflow: "hidden",
              opacity: isHome ? 0.6 : 1,
            }}
          >
            <span style={{ padding: "0.5rem 0.75rem", color: colors.textMuted, fontSize: "0.8125rem", borderRight: `1px solid ${colors.border}` }}>
              /
            </span>
            <input
              type="text"
              value={slug}
              disabled={isHome}
              onChange={(e) => setSlug(slugify(e.target.value))}
              style={{ ...modalInput, border: "none" }}
            />
          </div>
          {isHome && (
            <div style={{ fontSize: "0.75rem", color: colors.textDim, marginTop: "0.25rem" }}>
              The home page slug is fixed.
            </div>
          )}
        </Field>
        <Field label="SEO title (optional)">
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            style={modalInput}
          />
        </Field>
        <Field label="SEO description (optional)">
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            style={{ ...modalInput, resize: "vertical" }}
          />
        </Field>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Published (appears in site navigation)
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 0.75rem",
            background: colors.cardSubtle,
            border: `1px solid ${colors.border}`,
            borderRadius: "4px",
            fontSize: "0.8125rem",
          }}
        >
          <span style={{ color: colors.textMuted, flex: 1 }}>
            Position in nav: <strong style={{ color: colors.text }}>{pageIndex + 1} of {totalPages}</strong>
          </span>
          <button
            onClick={onMoveLeft}
            disabled={pageIndex === 0}
            style={{
              padding: "0.25rem 0.5rem",
              background: "white",
              border: `1px solid ${colors.border}`,
              borderRadius: "3px",
              cursor: pageIndex === 0 ? "not-allowed" : "pointer",
              color: pageIndex === 0 ? "#cfcfc8" : colors.text,
              fontSize: "0.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <ArrowLeft size={12} /> Move left
          </button>
          <button
            onClick={onMoveRight}
            disabled={pageIndex === totalPages - 1}
            style={{
              padding: "0.25rem 0.5rem",
              background: "white",
              border: `1px solid ${colors.border}`,
              borderRadius: "3px",
              cursor: pageIndex === totalPages - 1 ? "not-allowed" : "pointer",
              color: pageIndex === totalPages - 1 ? "#cfcfc8" : colors.text,
              fontSize: "0.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Move right <ArrowRight size={12} />
          </button>
        </div>
        {saveError && (
          <div
            style={{
              padding: "0.625rem 0.75rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "4px",
              color: colors.danger,
              fontSize: "0.8125rem",
            }}
          >
            {saveError}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
          {!isHome ? (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              style={{
                ...ghostBtn,
                color: colors.danger,
                borderColor: "rgba(185,28,28,0.3)",
              }}
            >
              {isDeleting ? "Deleting…" : "Delete page"}
            </button>
          ) : (
            <span />
          )}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={onClose} style={ghostBtn}>
              Cancel
            </button>
            <button
              onClick={() =>
                onSave({
                  title: title.trim(),
                  slug: isHome ? undefined : slug,
                  metaTitle: metaTitle.trim() || undefined,
                  metaDescription: metaDescription.trim() || undefined,
                  isPublished,
                })
              }
              disabled={isSaving}
              style={{ ...primaryBtn, opacity: isSaving ? 0.5 : 1 }}
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "32rem",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
      >
        <header
          style={{
            padding: "1rem 1.25rem",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: "1.125rem", fontWeight: 500 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: colors.textMuted,
              padding: "0.25rem",
            }}
          >
            <X size={16} />
          </button>
        </header>
        <div style={{ padding: "1.25rem" }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
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

const modalInput: React.CSSProperties = {
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

const primaryBtn: React.CSSProperties = {
  padding: "0.5rem 1rem",
  background: colors.accent,
  color: "#0d0d0d",
  border: "none",
  borderRadius: "4px",
  fontSize: "0.8125rem",
  fontWeight: 600,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  padding: "0.5rem 1rem",
  background: "transparent",
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: "4px",
  fontSize: "0.8125rem",
  fontWeight: 500,
  cursor: "pointer",
};

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
  if (status === "saving") return <span style={{ fontSize: "0.75rem", color: "#6e6e76" }}>Saving…</span>;
  if (status === "saved")
    return (
      <span style={{ fontSize: "0.75rem", color: "#15803d", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
        <Check size={12} strokeWidth={2.5} /> Saved
      </span>
    );
  if (status === "error") return <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>Error</span>;
  return null;
}
