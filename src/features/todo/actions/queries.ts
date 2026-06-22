"use server";

import { db } from "@/db/db.ts";
import { type Todo, todo } from "@/db/schema/todo-schema.ts";
import { isNotDeleted } from "@/db/utils.ts";
import { getCurrentUser } from "@/lib/auth.ts";
import type { Result } from "@/shared/types/result.ts";
import { and, desc, eq } from "drizzle-orm";

export async function getTodos(): Promise<Result<Todo[]>> {
  try {
    const auth = await getCurrentUser();
    if (!auth) return { success: false, error: "Unauthorized" };

    const data = await db
      .select()
      .from(todo)
      .where(and(eq(todo.userId, auth.user.id), isNotDeleted(todo)))
      .orderBy(desc(todo.createdAt));

    if (!data) {
      return { success: false, error: "No todos found" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to fetch todos" };
  }
}
