"use server";

import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "@/database/db.ts";
import { type Todo, todo } from "@/database/schema/todo-schema.ts";
import { getCurrentUser } from "@/lib/auth.ts";
import type { Result } from "@/shared/types/result.ts";
import {
  type CreateTodo,
  createTodoSchema,
  type UpdateTodo,
  updateTodoSchema,
} from "../validation/todo-validate.ts";

export async function createTodo(input: CreateTodo): Promise<Result<Todo>> {
  try {
    const auth = await getCurrentUser();
    if (!auth) return { success: false, error: "Unauthorized" };

    const parsed = createTodoSchema.parse(input);

    const [created] = await db
      .insert(todo)
      .values({ ...parsed, userId: auth.user.id })
      .returning();

    if (!created) return { success: false, error: "Failed to create todo" };

    revalidateTag("todos", "max");
    return { success: true, data: created };
  } catch (e) {
    console.error("[Create Todo Error]:", e instanceof Error ? e.message : "Unknown error");
    return { success: false, error: e instanceof Error ? e.message : "Failed to create todo" };
  }
}

export async function updateTodo(id: string, input: UpdateTodo): Promise<Result<Todo>> {
  try {
    const auth = await getCurrentUser();
    if (!auth) return { success: false, error: "Unauthorized" };

    const parsed = updateTodoSchema.parse(input);

    const [updated] = await db
      .update(todo)
      .set(parsed)
      .where(and(eq(todo.id, id), eq(todo.userId, auth.user.id)))
      .returning();

    if (!updated) return { success: false, error: "Todo not found" };

    revalidateTag("todos", "max");
    return { success: true, data: updated };
  } catch (e) {
    console.error("[Update Todo Error]:", e instanceof Error ? e.message : "Unknown error");
    return { success: false, error: e instanceof Error ? e.message : "Failed to update todo" };
  }
}

export async function deleteTodo(id: string): Promise<Result<null>> {
  try {
    const auth = await getCurrentUser();
    if (!auth) return { success: false, error: "Unauthorized" };

    const [deleted] = await db
      .update(todo)
      .set({ deletedAt: new Date() })
      .where(and(eq(todo.id, id), eq(todo.userId, auth.user.id)))
      .returning();

    if (!deleted) return { success: false, error: "Todo not found" };

    revalidateTag("todos", "max");
    return { success: true, data: null };
  } catch (e) {
    console.error("[Delete Todo Error]:", e instanceof Error ? e.message : "Unknown error");
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete todo" };
  }
}
