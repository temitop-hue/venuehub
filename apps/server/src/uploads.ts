import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";
import express from "express";
import type { Request, Response, NextFunction, Express } from "express";
import multer from "multer";
import { db, media } from "@venuehub/db";
import { verifyJWT } from "./auth";

const UPLOADS_DIR = process.env.UPLOADS_DIR || "/data/uploads";
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_MIME: Record<string, { ext: string; kind: "image" | "video" }> = {
  "image/jpeg": { ext: "jpg", kind: "image" },
  "image/png": { ext: "png", kind: "image" },
  "image/webp": { ext: "webp", kind: "image" },
  "image/gif": { ext: "gif", kind: "image" },
  "image/svg+xml": { ext: "svg", kind: "image" },
  "video/mp4": { ext: "mp4", kind: "video" },
  "video/webm": { ext: "webm", kind: "video" },
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function authRequired(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const headerToken = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.token;
  const token = headerToken || cookieToken;
  if (!token) {
    res.status(401).json({ error: "missing_token" });
    return;
  }
  const decoded = verifyJWT(token);
  if (!decoded) {
    res.status(401).json({ error: "invalid_token" });
    return;
  }
  (req as Request & { auth?: { userId: number; tenantId: number; role: string } }).auth = decoded;
  next();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype in ALLOWED_MIME) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

export function registerUploadRoutes(app: Express) {
  ensureDir(UPLOADS_DIR);

  app.use("/uploads", (_req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    next();
  });

  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    },
    express.static(UPLOADS_DIR, { fallthrough: false }),
  );

  app.post(
    "/api/upload",
    authRequired,
    upload.single("file"),
    async (req: Request, res: Response) => {
      const auth = (req as Request & { auth?: { userId: number; tenantId: number } }).auth;
      const file = (req as Request & { file?: Express.Multer.File }).file;
      if (!auth) {
        res.status(401).json({ error: "unauthenticated" });
        return;
      }
      if (!file) {
        res.status(400).json({ error: "missing_file" });
        return;
      }

      const meta = ALLOWED_MIME[file.mimetype];
      if (!meta) {
        res.status(400).json({ error: "unsupported_type", mimetype: file.mimetype });
        return;
      }

      const tenantDir = path.join(UPLOADS_DIR, String(auth.tenantId));
      ensureDir(tenantDir);

      const slug = randomBytes(10).toString("hex");
      const filename = `${Date.now()}-${slug}.${meta.ext}`;
      const absPath = path.join(tenantDir, filename);
      fs.writeFileSync(absPath, file.buffer);

      const publicUrl = `${getPublicBase(req)}/uploads/${auth.tenantId}/${filename}`;

      const [insert] = await db.insert(media).values({
        tenantId: auth.tenantId,
        url: publicUrl,
        type: meta.kind,
        alt: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      res.json({
        id: insert.insertId,
        url: publicUrl,
        type: meta.kind,
        mimeType: file.mimetype,
        size: file.size,
      });
    },
  );

  // Express error handler for multer failures (size, type)
  app.use("/api/upload", (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : "upload_failed";
    res.status(400).json({ error: "upload_failed", message });
  });
}

function getPublicBase(req: Request): string {
  if (process.env.UPLOADS_PUBLIC_BASE) return process.env.UPLOADS_PUBLIC_BASE.replace(/\/$/, "");
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string) || req.get("host") || "";
  return `${proto}://${host}`;
}
