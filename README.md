# VenueHub - Multi-tenant SaaS Venue Management Platform

A comprehensive platform for managing banquet halls, event venues, and their bookings. Built with a modern tech stack for scalability and performance.

## 🏗️ Project Structure

```
VenueHub/
├── apps/
│   ├── web/                 # React frontend application
│   └── server/              # Express backend with tRPC
├── packages/
│   ├── db/                  # Drizzle schema and migrations
│   └── shared/              # Shared types and utilities
└── .github/
    └── copilot-instructions.md
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express + tRPC + TypeScript
- **Database**: MySQL with Drizzle ORM
- **Package Manager**: npm with workspaces

## 📋 Features

### Core Functionality
- 👥 **Multi-tenant Architecture** - Complete tenant isolation
- 🏛️ **Venue Management** - Manage multiple banquet halls and venues
- 📅 **Event Booking** - Schedule and track event bookings
- 👨‍💼 **User & Staff Management** - Manage users, roles, and staff
- 📊 **Analytics & Reporting** - Track metrics and generate reports

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- MySQL 8.0+

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/venuehub
   NODE_ENV=development
   PORT=3000
   ```

3. **Setup database**
   ```bash
   npm run db:push
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📦 Workspaces

### Frontend (`apps/web`)
React application with tRPC client integration for type-safe API calls.

**Commands:**
```bash
npm run -w @venuehub/web dev      # Start dev server
npm run -w @venuehub/web build    # Build for production
npm run -w @venuehub/web lint     # Run linter
```

### Backend (`apps/server`)
Express server with tRPC router for API endpoints.

**Commands:**
```bash
npm run -w @venuehub/server dev       # Start dev server
npm run -w @venuehub/server build     # Build TypeScript
npm run -w @venuehub/server lint      # Run linter
```

### Database (`packages/db`)
Drizzle ORM schema and migrations for MySQL.

**Commands:**
```bash
npm run -w @venuehub/db generate   # Generate migrations
npm run -w @venuehub/db push       # Push schema to database
npm run -w @venuehub/db studio     # Open Drizzle Studio
```

### Shared (`packages/shared`)
Shared types and utilities across frontend and backend.

## 🗄️ Database Schema

### Tables
- **tenants** - Organization/tenant data
- **users** - User accounts with tenant association
- **venues** - Banquet halls and event venues
- **events** - Event bookings and scheduling
- **staff** - Staff member information

All tables include `tenant_id` for multi-tenant isolation.

## 🔌 API Architecture

APIs are built with tRPC providing:
- End-to-end type safety
- Automatic type inference
- Built-in validation with Zod

Example tRPC routes:
- `hello` - Example procedure
- `getSystemHealth` - System health check

## 🔒 Security & Architecture

- Database-level tenant isolation via `tenant_id`
- tRPC middleware for auth/tenant context
- Row-level security on all queries
- TypeScript for type safety

## 📝 Development Guidelines

### Adding a new tRPC route
1. Define Zod schema for input/output
2. Add procedure to relevant router
3. Protect with auth middleware
4. Test with frontend client

### Adding a new database table
1. Define schema in `packages/db/src/schema.ts`
2. Run `npm run db:generate`
3. Review migration in `packages/db/migrations/`
4. Run `npm run db:push` to apply

### Creating shared types
1. Add types to `packages/shared/src/types.ts`
2. Export and use in both frontend and backend

## 🧪 Testing

Currently uses TypeScript for type checking. Additional testing frameworks can be added as needed.

```bash
npm run type-check   # Run TypeScript type checking
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue in the repository.
