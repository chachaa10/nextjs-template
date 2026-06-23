import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "../database/db.ts";
import * as schema from "../database/schema/index.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [nextCookies()],
});

export const getCurrentUser = cache(async () => {
  const headersList = await headers();

  try {
    return await auth.api.getSession({
      headers: headersList,
    });
  } catch (error) {
    console.error("[Auth Session Error]:", error);
    return null;
  }
});
