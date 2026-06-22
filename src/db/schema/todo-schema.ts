import { id, timestamps } from "@/db/utils";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const todo = pgTable("todo", {
  id,
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  ...timestamps,
});

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
