# Railway MySQL Migration Instructions for VenueHub

1. **Create a Railway MySQL Database**
   - Go to https://railway.app/
   - Create a new project > Add Plugin > MySQL
   - Copy the connection string (it will look like: `mysql://user:password@host:port/database`)

2. **Update Your Local Environment**
   - In your project root, create or update a `.env` file:

```
DATABASE_URL=<your-railway-mysql-connection-string>
```

3. **Update Drizzle Config**
   - Ensure `packages/db/drizzle.config.ts` uses:
     - `driver: "mysql"`
     - `dialect: "mysql"`
     - `dbCredentials.connectionString: process.env.DATABASE_URL`

4. **Install dotenv (if not already)**
   - In `packages/db`, run:
     - `npm install dotenv --save-dev`

5. **Load .env in Drizzle Config**
   - Add at the top of `drizzle.config.ts`:
     - `import "dotenv/config";`

6. **Run Migration**
   - In `packages/db`, run:
     - `npx drizzle-kit generate`
     - `npx drizzle-kit push`

7. **Verify**
   - Check Railway dashboard for new tables.
   - Start your app. It should connect to Railway MySQL.

---

**If you want, I can update your drizzle.config.ts and create the .env template now.**