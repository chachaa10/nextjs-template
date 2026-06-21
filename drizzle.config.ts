import { defineConfig } from "drizzle-kit";
import { env } from "./src/core/config/env.ts";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/db/schemas/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
