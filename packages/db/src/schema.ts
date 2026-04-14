
import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp,
  decimal,
  boolean,
  datetime,
  mysqlEnum,
  json,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// Tenants/Organizations
export const tenants = mysqlTable("tenants", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: varchar("logo", { length: 255 }),
  onboardingComplete: boolean("onboarding_complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Users
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Venues/Banquet Halls
export const venues = mysqlTable("venues", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  capacity: int("capacity").notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  rentPrice: decimal("rent_price", { precision: 10, scale: 2 }),
  image: varchar("image", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Events/Bookings
export const events = mysqlTable("events", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  venueId: int("venue_id").notNull().references(() => venues.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  clientPhone: varchar("client_phone", { length: 20 }),
  eventDate: timestamp("event_date").notNull(),
  startTime: varchar("start_time", { length: 10 }),
  endTime: varchar("end_time", { length: 10 }),
  guestCount: int("guest_count"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  advanceAmount: decimal("advance_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Staffing
export const staff = mysqlTable("staff", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});




export const leads = mysqlTable("leads", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  eventType: varchar("event_type", { length: 100 }),
  eventDate: timestamp("event_date"),
  guestCount: int("guest_count"),
  budget: int("budget"),
  status: mysqlEnum("status", [
    "new",
    "contacted",
    "quoted",
    "negotiating",
    "booked",
    "lost",
  ]).default("new").notNull(),
  source: varchar("source", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Payments
export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  eventId: int("event_id").references(() => events.id),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "paid",
    "failed",
    "refunded",
  ]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Invoices
export const invoices = mysqlTable("invoices", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  eventId: int("event_id").references(() => events.id),
  total: int("total").notNull(),
  dueDate: timestamp("due_date"),
  status: mysqlEnum("status", [
    "draft",
    "sent",
    "paid",
    "overdue",
  ]).default("draft").notNull(),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Guests
export const guests = mysqlTable("guests", {
  id: int("id").primaryKey().autoincrement(),
  eventId: int("event_id").notNull().references(() => events.id),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  qrCode: varchar("qr_code", { length: 255 }),
  status: mysqlEnum("status", [
    "invited",
    "confirmed",
    "checked_in",
  ]).default("invited").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Site builder (public-facing tenant sites) ---

export const tenantThemes = mysqlTable("tenant_themes", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().unique().references(() => tenants.id),
  tone: mysqlEnum("tone", ["luxury", "modern", "minimal", "classic", "corporate"]).default("luxury").notNull(),
  primaryColor: varchar("primary_color", { length: 20 }).default("#0d0d0d").notNull(),
  secondaryColor: varchar("secondary_color", { length: 20 }).default("#f7f3ea").notNull(),
  accentColor: varchar("accent_color", { length: 20 }).default("#c9a86a").notNull(),
  headingFont: varchar("heading_font", { length: 100 }).default("Playfair Display").notNull(),
  bodyFont: varchar("body_font", { length: 100 }).default("Inter").notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  heroOverlayOpacity: decimal("hero_overlay_opacity", { precision: 3, scale: 2 }).default("0.45").notNull(),
  borderRadius: int("border_radius").default(2).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const pages = mysqlTable("pages", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  slug: varchar("slug", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  ogImage: varchar("og_image", { length: 500 }),
  isPublished: boolean("is_published").default(false).notNull(),
  hasDraft: boolean("has_draft").default(false).notNull(),
  displayOrder: int("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  tenantSlug: uniqueIndex("pages_tenant_slug_idx").on(t.tenantId, t.slug),
}));

export const blocks = mysqlTable("blocks", {
  id: int("id").primaryKey().autoincrement(),
  pageId: int("page_id").notNull().references(() => pages.id),
  blockType: varchar("block_type", { length: 100 }).notNull(),
  blockData: json("block_data").notNull(),
  displayOrder: int("display_order").default(0).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  isCurrentDraft: boolean("is_current_draft").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().unique().references(() => tenants.id),
  businessName: varchar("business_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 320 }),
  bookingEmail: varchar("booking_email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zip: varchar("zip", { length: 20 }),
  country: varchar("country", { length: 100 }).default("US"),
  timezone: varchar("timezone", { length: 50 }).default("America/New_York"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const navigation = mysqlTable("navigation", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  location: mysqlEnum("location", ["header", "footer"]).default("header").notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  href: varchar("href", { length: 500 }).notNull(),
  displayOrder: int("display_order").default(0).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const media = mysqlTable("media", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").notNull().references(() => tenants.id),
  url: varchar("url", { length: 500 }).notNull(),
  type: mysqlEnum("type", ["image", "video"]).default("image").notNull(),
  alt: varchar("alt", { length: 500 }),
  width: int("width"),
  height: int("height"),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Audit Logs (optional)
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").references(() => tenants.id),
  userId: int("user_id").references(() => users.id),
  action: varchar("action", { length: 255 }),
  entity: varchar("entity", { length: 100 }),
  entityId: int("entity_id"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
