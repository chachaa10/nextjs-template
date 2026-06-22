import { getCurrentUser } from "@/lib/auth.ts";
import { redirect } from "next/navigation";

import { getTodos } from "@/features/todo/actions/queries.ts";
import { TodoList } from "@/features/todo/components/todo-list.tsx";

export default async function TodoPage() {
  const auth = await getCurrentUser();

  if (!auth) {
    redirect("/login");
  }

  const result = await getTodos();

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 font-medium text-lg">Todo</h1>
      <TodoList initialTodos={result.data} />
    </div>
  );
}
