import { z } from "zod";

const PORT = 3000;

const envSchema = z.object({
  DATABASE_URL: z.string({ error: "DATABASE_URL is required" }).min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z
    .string({ error: "BETTER_AUTH_SECRET is required" })
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z
    .string({ error: "BETTER_AUTH_URL is required" })
    .url("BETTER_AUTH_URL must be a valid URL"),
  PORT: z.coerce.number().default(PORT),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`\nInvalid environment variables:\n${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
