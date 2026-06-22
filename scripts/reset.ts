// Reset Database
// Drops all tables and recreates them via migrations

import { env } from "@/core/config/env.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../src/db/schema/index.ts";

const sql = postgres(env.DATABASE_URL);
const db = drizzle(sql, { schema, casing: "snake_case" });

async function reset() {
  try {
    await sql.unsafe(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
    `);
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.error("Failed to reset database", error);
    process.exit(1);
  }
}

reset()
  .then(() => {
    console.log("Database reset successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to reset database", error);
    process.exit(1);
  });
