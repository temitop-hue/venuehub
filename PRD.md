# VenueHub - Multi-Tenant SaaS Venue Management Platform

**Product Requirements Document (PRD)**  
**Version:** 1.0  
**Last Updated:** April 2026  
**Status:** In Development

---

## 1. Executive Summary

VenueHub is a comprehensive, multi-tenant SaaS platform designed to help banquet halls, event venues, and wedding venues streamline their operations. It provides complete end-to-end management of venues, events/bookings, staff, and revenue tracking with advanced analytics, calendar views, and reporting capabilities.

**Key Value Propositions:**
- Centralized venue and booking management
- Multi-tenant architecture with complete data isolation
- Real-time revenue analytics and reporting
- Intuitive calendar-based event scheduling
- Role-based access control for team collaboration
- Built for scale with modern cloud-ready architecture

---

## 2. Vision & Goals

### Vision
To become the leading all-in-one management platform for event venues, enabling venue owners and managers to focus on delivering exceptional experiences while automating administrative tasks.

### Goals
1. **Goal 1:** Enable venues to manage bookings efficiently with 80% reduction in manual work
2. **Goal 2:** Provide actionable analytics for revenue optimization and business decisions
3. **Goal 3:** Support team collaboration with role-based permissions and multi-user access
4. **Goal 4:** Scale to thousands of venues with secure, isolated multi-tenant architecture
5. **Goal 5:** Deliver a mobile-friendly, intuitive user interface

---

## 3. Target Users

### Primary Users

#### 3.1 Venue Managers
- **Profile:** Manages day-to-day venue operations
- **Responsibilities:** Booking management, event scheduling, staff assignment
- **Needs:** Quick event lookup, status tracking, easiest-to-use interface

#### 3.2 Venue Owners
- **Profile:** Business owner/decision maker
- **Responsibilities:** Revenue tracking, policy setting, performance monitoring
- **Needs:** Analytics, revenue reports, KPI dashboards, admin controls

#### 3.3 Sales/Booking Team
- **Profile:** Handles customer inquiries and bookings
- **Responsibilities:** Create events, follow up with clients, confirm bookings
- **Needs:** Quick event creation, client history, status management

#### 3.4 Accounting/Finance Team
- **Profile:** Handles payments and financial reporting
- **Responsibilities:** Track advances, pending amounts, generate revenue reports
- **Needs:** Financial dashboards, export capabilities, payment tracking

---

## 4. Core Features

### 4.1 Authentication & Authorization

#### 4.1.1 User Registration
- Email-based registration with unique tenant creation
- Password hashing with bcrypt (salt rounds: 12)
- JWT token generation with 7-day expiration
- First registered user automatically assigned "admin" role

**API Endpoint:**
```
POST /trpc/auth.register
Input: { email, password, firstName, lastName }
Returns: { token, user: { id, email, firstName, lastName, role, tenantId } }
```

#### 4.1.2 User Login
- Email and password authentication
- JWT token generation with user role included
- Persistent token storage in localStorage
- Automatic session refresh on page load

**API Endpoint:**
```
POST /trpc/auth.login
Input: { email, password }
Returns: { token, user: { id, email, firstName, lastName, role, tenantId } }
```

#### 4.1.3 Session Management
- Automatic role extraction from JWT
- Bearer token validation on all protected routes
- Logout functionality clearing stored tokens
- Protected routes require valid authentication

### 4.2 Venue Management

#### 4.2.1 Create Venue
- Required fields: Venue name, capacity, rent price
- Optional fields: Description, address, city, state, zip code, phone, email, image URL
- Capacity: Integer representing guest capacity
- Rent price: Decimal with 2 decimal places

**API Endpoint:**
```
POST /trpc/venues.create
Input: { name, capacity, rentPrice, description?, address?, city?, state?, zipCode?, phone?, email?, image? }
Returns: { id, tenantId, name, capacity, rentPrice, ... }
```

#### 4.2.2 List Venues
- Retrieve all venues for current tenant
- Includes active and inactive venues
- Shows venue details: name, capacity, rent price, created date

**API Endpoint:**
```
GET /trpc/venues.list
Returns: Venue[]
```

#### 4.2.3 Update Venue
- Edit venue information
- Change capacity, rent price, contact details
- Supports partial updates

**API Endpoint:**
```
PUT /trpc/venues.update
Input: { id, name?, capacity?, rentPrice?, ... }
Returns: { success: true }
```

#### 4.2.4 Delete Venue
- Soft delete (mark inactive) or hard delete
- Cascade behavior: Associated events remain but venue reference invalid

**API Endpoint:**
```
DELETE /trpc/venues.delete
Input: { id }
Returns: { success: true }
```

### 4.3 Event/Booking Management

#### 4.3.1 Create Event
- Required fields: Title, client name, client email, event date, venue ID
- Optional fields: Description, start time, end time, guest count, status, amounts
- Status options: "pending" (default), "confirmed", "completed", "cancelled"
- Financial fields: totalAmount, advanceAmount (both decimal with 2 decimal places)

**API Endpoint:**
```
POST /trpc/events.create
Input: {
  title,
  clientName,
  clientEmail,
  eventDate,
  venueId,
  description?,
  startTime?,
  endTime?,
  guestCount?,
  totalAmount?,
  advanceAmount?,
  status?
}
Returns: { id, tenantId, venueId, title, ... }
```

#### 4.3.2 List Events
- Retrieve all events for current tenant
- Supports filtering by date range, venue, or status
- Includes associated venue information

**API Endpoint:**
```
GET /trpc/events.list
Returns: Event[]
```

#### 4.3.3 Update Event
- Modify event details
- Change status (pending → confirmed → completed or cancelled)
- Update financial information
- Reschedule events

**API Endpoint:**
```
PUT /trpc/events.update
Input: { id, title?, status?, totalAmount?, advanceAmount?, ... }
Returns: { success: true }
```

#### 4.3.4 Delete Event
- Remove event from system
- Option for soft delete (mark cancelled) or hard delete

**API Endpoint:**
```
DELETE /trpc/events.delete
Input: { id }
Returns: { success: true }
```

### 4.4 Staff Management

#### 4.4.1 Add Staff Member
- Required fields: Name, role/designation, email, phone
- Optional fields: Department, salary, hire date, specialization
- Track availability and assignments

**API Endpoint:**
```
POST /trpc/staff.create
Input: { name, email, phone, designation, department?, salary?, ... }
Returns: { id, tenantId, name, email, phone, designation, ... }
```

#### 4.4.2 List Staff
- Retrieve all staff members for current tenant
- Display: Name, designation, department, contact info
- Filter by status (active/inactive)

**API Endpoint:**
```
GET /trpc/staff.list
Returns: StaffMember[]
```

#### 4.4.3 Update Staff
- Modify staff information
- Update contact details, designation, department
- Enable/disable staff member

**API Endpoint:**
```
PUT /trpc/staff.update
Input: { id, name?, email?, phone?, designation?, ... }
Returns: { success: true }
```

#### 4.4.4 Delete Staff
- Remove staff member
- Option to soft delete (inactive) or hard delete

**API Endpoint:**
```
DELETE /trpc/staff.delete
Input: { id }
Returns: { success: true }
```

### 4.5 Tenant Management

#### 4.5.1 Create Tenant (Organization)
- Automatically created during registration
- Unique tenant ID for data isolation
- Tenant slug for multi-domain support

**API Endpoint:**
```
POST /trpc/tenants.create
Input: { name, slug, description?, logo? }
Returns: { id, name, slug, description, logo, createdAt, updatedAt }
```

#### 4.5.2 Get Tenant Info
- Retrieve organization details
- Used for organization settings and display

**API Endpoint:**
```
GET /trpc/tenants.get
Returns: { id, name, slug, description, logo, createdAt, updatedAt }
```

#### 4.5.3 Update Tenant
- Modify organization name, description, logo
- Update branding information

**API Endpoint:**
```
PUT /trpc/tenants.update
Input: { id, name?, slug?, description?, logo? }
Returns: { success: true }
```

---

## 5. Advanced Features

### 5.1 Role-Based Access Control (RBAC)

#### 5.1.1 Role Definitions
- **Admin:** Full system access, can manage users, settings, all data
- **Manager:** Can view/create/edit venues, events, and staff
- **Staff:** Can view assigned events and basic information
- **Guest:** Read-only access to specific events (future feature)

#### 5.1.2 Authorization Middleware
- Protected procedures check for authentication and role
- Admin procedures require `role === "admin"`
- Role information included in JWT token
- Automatic role extraction from token on every request

**Implementation:**
```typescript
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (ctx.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
```

### 5.2 Analytics Dashboard

#### 5.2.1 Summary Metrics
**Endpoint:** `GET /trpc/analytics.summary`

Returns the following KPIs:
- **Total Revenue:** Sum of all event totalAmount
- **Advance Collected:** Sum of all advanceAmount received
- **Balance Pending:** Total Revenue - Advance Collected
- **Total Guest Count:** Sum of all guestCount across events
- **Event Count by Status:**
  - Pending: Count of events with status "pending"
  - Confirmed: Count of events with status "confirmed"
  - Completed: Count of events with status "completed"
  - Cancelled: Count of events with status "cancelled"

**Response:**
```json
{
  "totalRevenue": 500000,
  "advanceCollected": 200000,
  "balancePending": 300000,
  "totalGuestCount": 5000,
  "eventStatusCounts": {
    "pending": 15,
    "confirmed": 25,
    "completed": 180,
    "cancelled": 5
  },
  "totalEvents": 225,
  "totalVenues": 8
}
```

#### 5.2.2 Revenue by Venue
**Endpoint:** `GET /trpc/analytics.revenueByVenue`

Groups revenue and event count by venue:
- Shows which venues generate most revenue
- Tracks bookings per venue
- Helps with resource allocation decisions

**Response:**
```json
[
  {
    "venueId": 1,
    "venueName": "Grand Ballroom",
    "totalRevenue": 150000,
    "eventCount": 25
  },
  {
    "venueId": 2,
    "venueName": "Intimate Garden",
    "totalRevenue": 100000,
    "eventCount": 40
  }
]
```

#### 5.2.3 Event Trends
**Endpoint:** `GET /trpc/analytics.eventTrends`

Time-series data of events and revenue:
- Grouped by month (YYYY-MM format)
- Shows seasonal patterns and growth
- Helps forecast demand

**Response:**
```json
[
  {
    "month": "2026-01",
    "eventCount": 20,
    "revenue": 50000
  },
  {
    "month": "2026-02",
    "eventCount": 22,
    "revenue": 55000
  },
  {
    "month": "2026-03",
    "eventCount": 28,
    "revenue": 70000
  }
]
```

#### 5.2.4 Status Breakdown
**Endpoint:** `GET /trpc/analytics.statusBreakdown`

Visual breakdown of event statuses:
- Shows distribution across pending, confirmed, completed, cancelled
- Helps track booking pipeline health

**Response:**
```json
{
  "pending": 15,
  "confirmed": 25,
  "completed": 180,
  "cancelled": 5
}
```

#### 5.2.5 Dashboard UI
- Metric cards with key stats and color-coded values
- Revenue figures displayed in local currency (₹)
- Event status breakdown with badge colors:
  - Green: Confirmed
  - Yellow: Pending
  - Blue: Completed
  - Red: Cancelled
- Revenue by venue table with sortable columns
- Real-time data updates

### 5.3 Calendar View

#### 5.3.1 Monthly Calendar
- Interactive calendar grid showing all events for the month
- Previous/Next month navigation
- Current date highlighted (yellow)
- Selected date highlighted (blue)

#### 5.3.2 Event Display on Calendar
- Events shown on their respective dates
- Event names displayed with truncation for space
- "+" indicator when 2+ events on same date
- Hover shows full event name

#### 5.3.3 Date Selection and Details
- Click any date to select it
- Sidebar shows selected date details
- Lists all events for that date with:
  - Event name
  - Venue name
  - Status badge (color-coded)

#### 5.3.4 Event Creation from Calendar
- Quick event creation form in sidebar
- Fields: Event name, venue, guest count, total amount, advance amount
- Create button submits and closes form
- Cancel button closes form without creating

#### 5.3.5 Calendar UX Features
- Keyboard navigation (if applicable)
- Event status filters (show/hide by status)
- View toggle (month/week/day - future feature)
- Event search within calendar

---

## 6. Planned Advanced Features (Phase 2)

### 6.1 Reports & Export
- **CSV Export:** Events, venues, revenue reports
- **PDF Export:** Invoice-style reports, booking confirmations
- **Custom Reports:** Date range, venue filter, status filter
- **Scheduled Reports:** Email reports on weekly/monthly basis

### 6.2 Email Notifications
- **Event Confirmations:** Automated email when event created
- **Booking Reminders:** Reminder emails before event date
- **Status Changes:** Email client when event status changes
- **Payment Reminders:** Reminder for pending balance payment
- **Admin Notifications:** Alert admins of new bookings
- **Signature:** Branded email templates with logo and contact info

### 6.3 Payment Integration (Stripe)
- **Payment Gateway:** Stripe API integration
- **Payment Methods:** Credit card, debit card, digital wallets
- **Payment Collection:** Collect deposits and full payments
- **Payment Status:** Track payment status per event
- **Invoicing:** Generate invoice with payment link
- **Payment History:** View transaction history
- **Refund Support:** Process refunds for cancelled events

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2+ |
| Frontend Build | Vite | 5.4+ |
| Backend | Express | 4.18+ |
| API Layer | tRPC | 10.28+ |
| Database | MySQL | 9.6+ |
| ORM | Drizzle | 0.29+ |
| Schema Validation | Zod | 3.22+ |
| Authentication | JWT + bcrypt | - |
| State Management | Zustand | - |
| HTTP Client | tRPC Client | - |
| Styling | Inline CSS + Tailwind | 3.0+ |

### 7.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                     │
│  React (18.2) + Vite (5.4)                              │
│  - LoginPage, DashboardPage, VenuesPage, EventsPage    │
│  - StaffPage, AnalyticsPage, CalendarPage              │
│  - Zustand Store (auth, user, role)                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTPS / tRPC
                 │
┌─────────────────────────────────────────────────────────┐
│              Express Server (3001)                      │
│  - CORS Middleware (localhost:5173, 5174)              │
│  - Cookie Parser, JSON Parser                          │
│  - tRPC Router Handler                                 │
└──────┬──────────────────────────────────────────────────┘
       │
       │ tRPC Routers
       │
┌──────────────────────────────────────────────────────────┐
│         tRPC Procedure Definitions                      │
│  - authRouter: register, login, me                     │
│  - venueRouter: create, list, update, delete           │
│  - eventRouter: create, list, update, delete           │
│  - staffRouter: create, list, update, delete           │
│  - tenantRouter: create, get, update                   │
│  - analyticsRouter: summary, revenueByVenue,          │
│                     eventTrends, statusBreakdown      │
└──────┬──────────────────────────────────────────────────┘
       │
       │ Drizzle ORM
       │
┌──────────────────────────────────────────────────────────┐
│           MySQL Database (9.6)                         │
│  Tables:                                               │
│  - tenants (id, name, slug, description, logo, ...)   │
│  - users (id, email, password, firstName, lastName,   │
│            role, tenantId, isActive, createdAt, ...)  │
│  - venues (id, tenantId, name, capacity, rentPrice,  │
│            address, city, state, zipCode, ...)        │
│  - events (id, tenantId, venueId, title, clientName, │
│            eventDate, guestCount, totalAmount, ...)   │
│  - staff (id, tenantId, name, email, phone, ...)      │
└──────────────────────────────────────────────────────────┘
```

### 7.3 Authentication Flow

```
User Login
    │
    ├─► POST /trpc/auth.login
    │   Input: { email, password }
    │
    ├─► Validate email & password with bcrypt
    │
    ├─► Generate JWT with payload:
    │   { userId, tenantId, email, role }
    │   Expiry: 7 days
    │
    └─► Return: { token, user { id, email, firstName, lastName, role } }
        Store token in localStorage

Protected Routes
    │
    ├─► Authorization header: "Bearer <JWT_TOKEN>"
    │
    ├─► Extract token from header
    │
    ├─► Verify JWT signature & expiry
    │
    ├─► Extract userId, tenantId, email, role from payload
    │
    └─► Attach to context for procedure access
```

### 7.4 Multi-Tenant Isolation Strategy

**Data Isolation:**
- Every user query filtered by `ctx.tenantId`
- Foreign key constraints link venues, events, staff to tenants
- No cross-tenant data leakage possible at database level

**Implementation:**
```typescript
// Every query includes tenantId filter
const venues = await db.query.venues.findMany({
  where: (venues, { eq }) => eq(venues.tenantId, ctx.tenantId),
});
```

**Security:**
- JWT includes tenantId to prevent ID spoofing
- All mutations validate tenantId matches context
- Admin procedures restricted to same tenant only

---

## 8. Database Schema

### 8.1 Tables & Relationships

```sql
-- Tenants (Organizations)
CREATE TABLE tenants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenantId INT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id),
  UNIQUE KEY (tenantId, email)
);

-- Venues
CREATE TABLE venues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenantId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  capacity INT NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  rentPrice DECIMAL(10,2),
  image VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id),
  INDEX idx_tenant_active (tenantId, isActive)
);

-- Events
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenantId INT NOT NULL,
  venueId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  clientName VARCHAR(255) NOT NULL,
  clientEmail VARCHAR(255) NOT NULL,
  clientPhone VARCHAR(20),
  eventDate TIMESTAMP NOT NULL,
  startTime VARCHAR(10),
  endTime VARCHAR(10),
  guestCount INT,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  totalAmount DECIMAL(10,2),
  advanceAmount DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id),
  FOREIGN KEY (venueId) REFERENCES venues(id),
  INDEX idx_tenant_date (tenantId, eventDate),
  INDEX idx_venue_date (venueId, eventDate),
  INDEX idx_status (status)
);

-- Staff
CREATE TABLE staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenantId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  designation VARCHAR(100),
  department VARCHAR(100),
  salary DECIMAL(10,2),
  hireDate DATE,
  specialization TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id),
  INDEX idx_tenant_active (tenantId, isActive)
);
```

### 8.2 Indexing Strategy

- **Tenant-based:** All queries filter by tenantId, so (tenantId, column) composite indexes
- **Date-based:** Events frequently queried by date range
- **Status-based:** Events filtered by status for analytics
- **Foreign keys:** Indexed for join performance

---

## 9. API Specification

### 9.1 Base URL
- Development: `http://localhost:3001/trpc`
- Production: `https://api.venuehub.com/trpc`

### 9.2 Request Format
- All requests via tRPC (RPC over HTTP)
- JSON request body
- Authorization: `Authorization: Bearer <JWT_TOKEN>` header

### 9.3 Response Format

**Success Response:**
```json
{
  "result": {
    "data": { /* response data */ }
  }
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Error description",
    "code": "UNAUTHORIZED" | "FORBIDDEN" | "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR"
  }
}
```

### 9.4 Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | User lacks permission |
| BAD_REQUEST | 400 | Invalid input validation |
| NOT_FOUND | 404 | Resource not found |
| INTERNAL_SERVER_ERROR | 500 | Server error |

### 9.5 All Endpoints Reference

**Auth Routes:**
- `POST /trpc/auth.register` - User registration
- `POST /trpc/auth.login` - User login
- `GET /trpc/auth.me` - Get current user

**Venue Routes:**
- `POST /trpc/venues.create` - Create venue (protected)
- `GET /trpc/venues.list` - List venues (protected)
- `PUT /trpc/venues.update` - Update venue (protected)
- `DELETE /trpc/venues.delete` - Delete venue (protected)

**Event Routes:**
- `POST /trpc/events.create` - Create event (protected)
- `GET /trpc/events.list` - List events (protected)
- `PUT /trpc/events.update` - Update event (protected)
- `DELETE /trpc/events.delete` - Delete event (protected)

**Staff Routes:**
- `POST /trpc/staff.create` - Add staff (protected)
- `GET /trpc/staff.list` - List staff (protected)
- `PUT /trpc/staff.update` - Update staff (protected)
- `DELETE /trpc/staff.delete` - Delete staff (protected)

**Tenant Routes:**
- `POST /trpc/tenants.create` - Create tenant (protected)
- `GET /trpc/tenants.get` - Get tenant info (protected)
- `PUT /trpc/tenants.update` - Update tenant (protected)

**Analytics Routes:**
- `GET /trpc/analytics.summary` - Get KPI summary (protected)
- `GET /trpc/analytics.revenueByVenue` - Revenue breakdown (protected)
- `GET /trpc/analytics.eventTrends` - Monthly trends (protected)
- `GET /trpc/analytics.statusBreakdown` - Event status counts (protected)

---

## 10. User Flows

### 10.1 New User Onboarding

```
1. Visit app.venuehub.com → LoginPage
2. Click "Sign Up"
3. Enter: Email, Password, First Name, Last Name
4. POST /trpc/auth.register
   - Validate input (Zod schema)
   - Hash password (bcrypt)
   - Create tenant (organization)
   - Create user with role="admin"
   - Generate JWT token
   - Return token + user info
5. Redirect to DashboardPage
6. Store token in localStorage
```

### 10.2 Create Event Workflow

```
1. On EventsPage, click "+ Create Event"
2. Modal/form opens with fields:
   - Event Name (required)
   - Venue (dropdown, required)
   - Client Name (required)
   - Client Email (required)
   - Client Phone (optional)
   - Event Date (date picker, required)
   - Start Time (optional)
   - End Time (optional)
   - Guest Count (optional)
   - Total Amount (optional)
   - Advance Amount (optional)
   - Status (dropdown, default: "pending")
3. User fills form
4. Click "Create Event"
5. POST /trpc/events.create
   - Validate: All required fields, tenantId matches
   - Create event record in database
   - Return: event ID and details
6. Modal closes, event appears in list
7. User can click event to view/edit
```

### 10.3 View Analytics Workflow

```
1. Click "Analytics" in navigation
2. AnalyticsPage loads
3. Fetch queries in parallel:
   - summary → 4 metric cards
   - revenueByVenue → table
   - eventTrends → chart data (future)
   - statusBreakdown → status section
4. Display: Revenue cards, event status breakdown, venue performance table
5. Data refreshes on page reload or click "Refresh"
6. User can navigate to specific venue for drill-down (future)
```

### 10.4 Calendar Event Creation

```
1. Click "Calendar" in navigation
2. CalendarPage loads - shows current month
3. Click a date to select it
4. Sidebar shows form: "Create Event"
5. Fill: Event Name, Venue, Guest Count, Amounts
6. Click "Create"
7. POST /trpc/events.create
8. Event appears on calendar date
9. Event shows status badge color on calendar
```

---

## 11. Frontend Components

### 11.1 Page Components

| Component | Route | Purpose |
|-----------|-------|---------|
| LoginPage | / | User login & registration |
| DashboardPage | /dashboard | Overview with quick stats |
| VenuesPage | /venues | CRUD for venues |
| EventsPage | /events | CRUD for events/bookings |
| StaffPage | /staff | CRUD for staff members |
| AnalyticsPage | /analytics | Revenue & performance dashboard |
| CalendarPage | /calendar | Interactive event calendar |

### 11.2 Shared Components

- Header/Navigation Bar (on all pages except login)
- User Profile Display
- Logout Button
- Navigation Links (Dashboard, Venues, Events, Staff, Analytics, Calendar)
- Active Route Highlighting

### 11.3 Common UI Patterns

- **Forms:** Input validation, error messages, submit/cancel buttons
- **Tables:** Sortable columns, pagination (future), edit/delete actions
- **Modals:** Create/edit forms, confirm dialogs, loading states
- **Status Badges:** Color-coded (green/yellow/blue/red)
- **Cards:** Metric cards with icon, value, label
- **Dropdowns:** Venue selection, status selection

---

## 12. Security Considerations

### 12.1 Authentication
- ✅ JWT with expiration (7 days)
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Bearer token in Authorization header
- ✅ Token refresh on page load

### 12.2 Authorization
- ✅ Role-based access control (admin/manager/staff)
- ✅ Procedure-level protection (protectedProcedure)
- ✅ Admin-only procedures verification
- ✅ TenantId validation on all mutations

### 12.3 Data Protection
- ✅ Multi-tenant isolation at database level
- ✅ Foreign key constraints
- ✅ Input validation via Zod schemas
- ✅ SQL injection prevention (ORM-based)

### 12.4 CORS
- ✅ Whitelist localhost:5173, 5174 (development)
- ✅ Credentials allowed
- ✅ Proper headers (Content-Type, Authorization)

### 12.5 Future Security
- [ ] HTTPS/TLS enforcement
- [ ] Rate limiting
- [ ] IP whitelisting for admin areas
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] Encryption at rest

---

## 13. Deployment & Scaling

### 13.1 Development Environment
- Frontend: Vite dev server (localhost:5174)
- Backend: Node.js with tsx (localhost:3001)
- Database: Local MySQL (localhost:3306)

### 13.2 Production Environment
- Frontend: Vite build → static hosting (Vercel/Netlify)
- Backend: Express → Docker container → Kubernetes/railway.app
- Database: Managed MySQL (AWS RDS / PlanetScale)
- CDN: CloudFlare for static assets

### 13.3 Scaling Strategy
- **Horizontal:** Load balancer → multiple Express instances
- **Vertical:** Database optimization, connection pooling
- **Caching:** Redis for session storage (future)
- **Queue:** Bull/RabbitMQ for async jobs (future: email, exports)

---

## 14. Success Metrics & KPIs

### 14.1 Business Metrics
- **User Acquisition:** Target 100 venues in year 1
- **Retention:** 80% monthly retention rate
- **Revenue:** Track ARPU (Average Revenue Per User)
- **Churn:** <5% monthly churn

### 14.2 Product Metrics
- **Booking Creation Time:** <2 minutes from registration to first event
- **Page Load Time:** All pages <2 seconds
- **API Latency:** <500ms for 95th percentile
- **Dashboard Load:** Analytics page <1 second

### 14.3 Feature Adoption
- **Analytics Page:** 60% of users view monthly
- **Calendar Usage:** 40% prefer calendar over list view
- **Report Generation:** 50% export reports quarterly
- **Email Notifications:** 80% prefer automated emails

### 14.4 Quality Metrics
- **Uptime:** 99.9% availability
- **Error Rate:** <0.1% of requests with errors
- **User Satisfaction:** NPS score >50

---

## 15. Roadmap & Future Enhancements

### Phase 2 (Q2 2026)
- [ ] PDF/CSV report export
- [ ] Email notification system
- [ ] Advanced analytics with charts (Recharts/Chart.js)
- [ ] Mobile app (React Native)

### Phase 3 (Q3 2026)
- [ ] Stripe payment integration
- [ ] Payment collection workflow
- [ ] Invoice generation
- [ ] Recurring event templates

### Phase 4 (Q4 2026)
- [ ] Team member roles (manager, staff)
- [ ] Event templates & packages
- [ ] Customer portal (self-service booking)
- [ ] SMS notifications

### Phase 5 (2027)
- [ ] Marketplace for vendors (caterers, decorators)
- [ ] Multi-currency support
- [ ] White-label SaaS
- [ ] Mobile app (iOS)

---

## 16. Glossary

| Term | Definition |
|------|-----------|
| Tenant | An organization/venue owner account with isolated data |
| Event | A booking/reservation for a venue on a specific date |
| Venue | A banquet hall or event space available for booking |
| Admin | User role with full system access |
| Manager | User role with event/venue management access (future) |
| JWT | JSON Web Token for stateless authentication |
| tRPC | TypeScript RPC framework for type-safe APIs |
| CORS | Cross-Origin Resource Sharing (browser security) |
| Drizzle | Object-relational mapping (ORM) library |
| Zod | TypeScript schema validation library |

---

## 17. Appendix: Development Setup

### 17.1 Local Environment Setup

```bash
# Clone repository
git clone https://github.com/yourusername/venuehub.git
cd venuehub

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Database setup
npm run db:push

# Start servers
npm run dev  # Runs both backend and frontend
```

### 17.2 Project Structure
```
venuehub/
├── apps/
│   ├── server/          # Express backend
│   │   └── src/
│   │       ├── routers/  # tRPC route handlers
│   │       ├── auth.ts   # JWT & password utils
│   │       ├── context.ts # Auth context extraction
│   │       └── index.ts  # Server entry point
│   └── web/             # React frontend
│       └── src/
│           ├── pages/    # Route components
│           ├── store/    # Zustand stores
│           └── App.tsx   # Main router
├── packages/
│   ├── db/              # Drizzle schema
│   └── shared/          # Shared types
└── PRD.md               # This document
```

---

**Document Version:** 1.0  
**Last Updated:** April 13, 2026  
**Status:** APPROVED FOR DEVELOPMENT

For questions or updates, please contact the product team.
