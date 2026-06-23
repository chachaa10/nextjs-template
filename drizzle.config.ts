import { defineConfig } from "drizzle-kit";
import { env } from "./src/core/config/env";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/database/schema/index",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
