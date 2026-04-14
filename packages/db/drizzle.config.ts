import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "mysql",
  host: "monorail.proxy.rlwy.net",
  port: 31664,
  user: "root",
  password: "flccZPsEUcIFDkSquppNMTrqRNXasjyY",
  database: "railway",
});
