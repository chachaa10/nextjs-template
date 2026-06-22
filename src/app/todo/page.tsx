import { getTodos } from "@/features/todo/actions/queries.ts";
import { TodoList } from "@/features/todo/components/todo-list.tsx";
import { getCurrentUser } from "@/lib/auth.ts";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function TodoPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 font-medium text-lg">Todo</h1>
      <Suspense fallback={<p className="text-muted-foreground text-sm">Loading...</p>}>
        <TodoContent />
      </Suspense>
    </div>
  );
}

async function TodoContent() {
  const auth = await getCurrentUser();

  if (!auth) {
    redirect("/login");
  }

  const result = await getTodos();

  if (!result.success) {
    throw new Error(result.error);
  }

  return <TodoList initialTodos={result.data} />;
}
