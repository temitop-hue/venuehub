
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
} from "drizzle-orm/mysql-core";

// Tenants/Organizations
export const tenants = mysqlTable("tenants", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: varchar("logo", { length: 255 }),
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
