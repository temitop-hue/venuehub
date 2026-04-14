# VenueHub - Multi-tenant SaaS Venue Management Platform

## Project Overview
VenueHub is a full-stack multi-tenant SaaS platform for managing banquet halls, event venues, and their bookings. Built with React, Express, tRPC, MySQL, and Drizzle ORM.

## Tech Stack
- **Frontend**: React with TypeScript
- **Backend**: Express with tRPC
- **Database**: MySQL with Drizzle ORM
- **API**: tRPC for end-to-end typesafe APIs
- **Package Manager**: npm/yarn

## Development Guidelines

### Code Structure
- `apps/web/` - React frontend application
- `apps/server/` - Express backend with tRPC routers
- `packages/db/` - Drizzle schema and migrations
- `packages/shared/` - Shared types and utilities

### Multi-tenant Architecture
- Tenant isolation at database level
- Tenant context passed through tRPC middleware
- Row-level security considerations

### Feature Areas
1. Tenant & Organization Management
2. Venue/Hall Management
3. Event Booking & Scheduling
4. User & Staff Management
5. Analytics & Reporting

### Setup & Development
```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

### Database
- Use Drizzle migrations for schema changes
- Ensure tenant_id on all multi-tenant tables
- Create indexes on frequently queried columns

### API Development
- Use tRPC routers organized by feature
- Add auth middleware for protected routes
- Validate input using zod schemas
