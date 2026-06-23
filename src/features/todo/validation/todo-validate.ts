import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().max(1000),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().max(1000).optional(),
});

export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
