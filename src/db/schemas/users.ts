import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { id } from "../utils.ts";

export const users = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: timestamp({ withTimezone: true }),
  image: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
