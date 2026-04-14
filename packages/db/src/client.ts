import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2/driver";
import * as schema from "./schema";

// Parse DATABASE_URL
const getDatabaseConfig = () => {
  const dbUrl = process.env.DATABASE_URL || "mysql://root:admin@localhost:3306/venuehub";
  
  console.log("Database URL:", dbUrl ? dbUrl.replace(/\/\/root:[^@]+@/, "//root:***@") : "NOT SET");
  
  try {
    const url = new URL(dbUrl);
    const config = {
      host: url.hostname || "localhost",
      port: url.port ? parseInt(url.port) : 3306,
      user: decodeURIComponent(url.username || "root"),
      password: decodeURIComponent(url.password || "admin"),
      database: url.pathname?.slice(1) || "venuehub",
    };
    console.log("Database config:", { host: config.host, port: config.port, user: config.user, database: config.database });
    return config;
  } catch (error) {
    console.error("Failed to parse DATABASE_URL, using defaults:", error);
    return {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "admin",
      database: process.env.DB_NAME || "venuehub",
    };
  }
};

const config = getDatabaseConfig();

const poolConnection = mysql.createPool({
  host: config.host,
  port: (config as { port?: number }).port ?? 3306,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { 
  schema,
  mode: "default"
});
export type Database = typeof db;
