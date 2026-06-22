"use client";

import type { Route } from "next";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { LoginSchema } from "../validation/auth-validate.ts";

export function LoginForm({ redirectTo }: { redirectTo: Route | undefined }) {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onChange: () => { setAuthError(null); },
      onSubmit: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);
      const { error } = await authClient.signIn.email(value);
      if (error) {
        setAuthError(error.message ?? "Invalid email or password");
        return;
      }
      router.push(redirectTo ?? "/");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field name="email" validators={{ onBlur: LoginSchema.shape.email }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password" validators={{ onBlur: LoginSchema.shape.password }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {authError ? <FieldError>{authError}</FieldError> : null}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
