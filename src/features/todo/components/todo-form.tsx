"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { type CreateTodo, createTodoSchema } from "../validation/todo-validate.ts";

type SubmitHandler = (values: CreateTodo) => Promise<{ success: boolean; error?: string }>;

interface TodoFormProps {
  mode: "create" | "edit";
  initialValues?: CreateTodo | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler;
}

export function TodoForm({ mode, initialValues, open, onOpenChange, onSubmit }: TodoFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: initialValues ?? { title: "", description: "" },
    validators: {
      onChange: () => {
        setServerError(null);
      },
      onSubmit: createTodoSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const result = await onSubmit(value);
      if (!result.success) {
        setServerError(result.error ?? "Something went wrong");
        return;
      }
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New Todo" : "Edit Todo"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <form.Field name="title" validators={{ onBlur: createTodoSchema.shape.title }}>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="What needs to be done?"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional details..."
                      autoComplete="off"
                      className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                    />
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {serverError ? <FieldError>{serverError}</FieldError> : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
