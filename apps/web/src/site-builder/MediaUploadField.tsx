import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Film } from "lucide-react";

const colors = {
  border: "#e8e8e4",
  borderDash: "#cfcfc8",
  borderActive: "#c9a86a",
  text: "#17171a",
  textMuted: "#6e6e76",
  textDim: "#9b9ba1",
  bg: "#ffffff",
  bgSubtle: "#fafaf5",
  accent: "#c9a86a",
  error: "#b91c1c",
};

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");

const ACCEPT_MAP: Record<string, string> = {
  image: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  video: "video/mp4,video/webm",
  "image-or-video": "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm",
};

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function looksLikeDataOrHttpUrl(s: string): boolean {
  return /^(https?:|data:|\/)/.test(s);
}

export function MediaUploadField({
  value,
  onChange,
  accept,
}: {
  value: unknown;
  onChange: (url: string) => void;
  accept: "image" | "video" | "image-or-video";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stringValue = typeof value === "string" ? value : "";
  const isMedia = looksLikeDataOrHttpUrl(stringValue);
  const showVideoPreview = isMedia && isVideoUrl(stringValue);
  const showImagePreview = isMedia && !showVideoPreview;

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    const token = localStorage.getItem("token") || "";

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE}/api/upload`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.url) {
                onChange(data.url);
                resolve();
                return;
              }
            } catch {
              /* fall through */
            }
            reject(new Error("Invalid response from server"));
          } else {
            let msg = "Upload failed";
            try {
              const data = JSON.parse(xhr.responseText);
              msg = data.message || data.error || msg;
            } catch {
              /* keep default */
            }
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        const form = new FormData();
        form.append("file", file);
        xhr.send(form);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: `1px dashed ${isDragging ? colors.borderActive : colors.borderDash}`,
          borderRadius: "6px",
          padding: isMedia ? "0.5rem" : "1.25rem",
          background: isDragging ? "rgba(201,168,106,0.05)" : colors.bgSubtle,
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        {isMedia ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div
              style={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
                background: "#111",
                aspectRatio: "16/9",
              }}
            >
              {showVideoPreview ? (
                <video
                  src={stringValue}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  controls
                  muted
                />
              ) : showImagePreview ? (
                <img
                  src={stringValue}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
              <button
                onClick={() => onChange("")}
                title="Remove"
                style={{
                  position: "absolute",
                  top: "0.375rem",
                  right: "0.375rem",
                  width: "1.5rem",
                  height: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => inputRef.current?.click()}
                style={pillBtn}
                disabled={uploading}
              >
                <Upload size={12} strokeWidth={2.25} /> Replace
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                margin: "0 auto 0.5rem",
                borderRadius: "8px",
                background: "rgba(201,168,106,0.1)",
                color: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {accept === "video" ? <Film size={18} /> : <ImageIcon size={18} />}
            </div>
            <div style={{ fontSize: "0.8125rem", color: colors.text, fontWeight: 500 }}>
              Drop a file here or
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              style={{
                marginTop: "0.5rem",
                padding: "0.375rem 0.875rem",
                background: colors.accent,
                color: "#0d0d0d",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              disabled={uploading}
            >
              <Upload size={12} strokeWidth={2.25} />
              {uploading ? `Uploading… ${progress}%` : "Choose file"}
            </button>
            <div style={{ fontSize: "0.6875rem", color: colors.textDim, marginTop: "0.5rem" }}>
              {accept === "image"
                ? "JPG, PNG, WEBP, GIF, SVG · up to 25MB"
                : accept === "video"
                  ? "MP4 or WEBM · up to 25MB"
                  : "Image or video · up to 25MB"}
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {uploading && (
        <div
          style={{
            marginTop: "0.5rem",
            height: "3px",
            background: colors.border,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: colors.accent,
              transition: "width 0.2s ease",
            }}
          />
        </div>
      )}

      {error && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: colors.error }}>
          {error}
        </div>
      )}

      <input
        type="text"
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a URL…"
        style={{
          width: "100%",
          marginTop: "0.5rem",
          padding: "0.5rem 0.625rem",
          fontSize: "0.75rem",
          fontFamily: '"Inter", sans-serif',
          color: colors.textMuted,
          background: "transparent",
          border: `1px solid ${colors.border}`,
          borderRadius: "4px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
    </div>
  );
}

const pillBtn: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  background: "transparent",
  color: "#17171a",
  border: `1px solid #e8e8e4`,
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: 500,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
};
