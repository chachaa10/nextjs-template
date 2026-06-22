"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog.tsx";
import type { Todo } from "@/db/schema/todo-schema.ts";
import { createTodo, deleteTodo, updateTodo } from "../actions/mutations.ts";
import { TodoForm } from "./todo-form.tsx";
import type { CreateTodo } from "../validation/todo-schema.ts";

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface TodoListProps {
  initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

  const mode = editingTodo ? "edit" as const : "create" as const;
  const initialValues = editingTodo
    ? { title: editingTodo.title, description: editingTodo.description ?? "" }
    : undefined;

  function openCreate() {
    setEditingTodo(null);
    setDialogOpen(true);
  }

  function openEdit(todo: Todo) {
    setEditingTodo(todo);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingTodo(null);
  }

  async function handleSubmit(values: CreateTodo) {
    if (editingTodo) {
      const result = await updateTodo(editingTodo.id, values);
      if (result.success) {
        setTodos((prev) => prev.map((t) => (t.id === result.data.id ? result.data : t)));
      }
      return result;
    }

    const result = await createTodo(values);
    if (result.success) {
      setTodos((prev) => [result.data, ...prev]);
    }
    return result;
  }

  async function handleDelete(todo: Todo) {
    const result = await deleteTodo(todo.id);
    if (result.success) {
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    }
  }

  const columnHelper = createColumnHelper<Todo>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue() ?? <span className="text-muted-foreground">—</span>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (info) => (
        <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingTodo(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {todos.length} {todos.length === 1 ? "todo" : "todos"}
        </p>
        <Button onClick={openCreate}>New Todo</Button>
      </div>

      {todos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <p className="text-muted-foreground text-sm">No todos yet</p>
            <Button onClick={openCreate} variant="outline">
              Create your first todo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Todos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-border border-b">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-2 text-left font-medium text-muted-foreground"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-border border-b last:border-0 hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deletingTodo}
        onOpenChange={() => setDeletingTodo(null)}
        title="Delete Todo"
        description={
          deletingTodo
            ? `Are you sure you want to delete "${deletingTodo.title}"?`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deletingTodo) handleDelete(deletingTodo);
        }}
      />

      <TodoForm
        key={mode + (editingTodo?.id ?? "new")}
        mode={mode}
        initialValues={initialValues}
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
