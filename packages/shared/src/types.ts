import { z } from "zod";

// Tenant Types
export const TenantSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Tenant = z.infer<typeof TenantSchema>;

// User Types
export const UserSchema = z.object({
  id: z.number(),
  tenantId: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["admin", "manager", "user"]),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Venue Types
export const VenueSchema = z.object({
  id: z.number(),
  tenantId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  capacity: z.number(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  rentPrice: z.number().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Venue = z.infer<typeof VenueSchema>;

// Event Types
export const EventSchema = z.object({
  id: z.number(),
  tenantId: z.number(),
  venueId: z.number(),
  title: z.string(),
  description: z.string().optional(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  eventDate: z.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  guestCount: z.number().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  totalAmount: z.number().optional(),
  advanceAmount: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Event = z.infer<typeof EventSchema>;
