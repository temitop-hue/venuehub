import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env.local");

// Re-load env from root
import dotenv from "dotenv";
dotenv.config({ path: envPath });

import express from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { router } from "./trpc";
import { createContext } from "./trpc";
import { authRouter } from "./routers/auth";
import { venueRouter } from "./routers/venues";
import { eventRouter } from "./routers/events";
import { tenantRouter } from "./routers/tenants";
import { staffRouter } from "./routers/staff";
import { analyticsRouter } from "./routers/analytics";
import { leadsRouter } from "./routers/leads";
import { publicSiteRouter } from "./routers/publicSite";
import { onboardingRouter } from "./routers/onboarding";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.WEB_ORIGIN ? [process.env.WEB_ORIGIN] : []),
];
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin || "")) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Create app router
const appRouter = router({
  auth: authRouter,
  venues: venueRouter,
  events: eventRouter,
  tenants: tenantRouter,
  staff: staffRouter,
  analytics: analyticsRouter,
  leads: leadsRouter,
  publicSite: publicSiteRouter,
  onboarding: onboardingRouter,
});

// tRPC handler
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "VenueHub API Server", version: "1.0.0" });
});

const port = parseInt(process.env.PORT || "3001");

app.listen(port, () => {
  console.log(`✓ VenueHub API Server running on port ${port}`);
  console.log(`  http://localhost:${port}`);
  console.log(`  tRPC endpoint: http://localhost:${port}/trpc`);
  console.log(`  Health check: http://localhost:${port}/health`);
});

export type AppRouter = typeof appRouter;
