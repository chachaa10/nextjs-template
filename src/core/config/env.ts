import { z } from "zod";

const PORT = 3000;

const envSchema = z.object({
  DATABASE_URL: z.string({ error: "DATABASE_URL is required" }).min(1, "DATABASE_URL is required"),
  PORT: z.coerce.number().default(PORT),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`\nInvalid environment variables:\n${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
