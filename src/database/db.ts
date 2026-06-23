import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../core/config/env.ts";
import * as schema from "./schema/index.ts";

const client = postgres(env.DATABASE_URL);

export const db = drizzle({ client, schema, casing: "snake_case" });
