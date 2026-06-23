"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { Result } from "@/shared/types/result";
import {
  type LoginFormData,
  LoginSchema,
  type SignUpFormData,
  signUpSchema,
} from "../validation/auth-validate";

export async function signOutAction(): Promise<Result<unknown>> {
  try {
    const header = await headers();
    return { success: true, data: await auth.api.signOut({ headers: header }) };
  } catch (error: unknown) {
    console.error(
      "Sign out error:",
      error instanceof Error ? error.message : "Something went wrong",
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function signInAction(data: LoginFormData): Promise<Result<unknown>> {
  const parsed = await LoginSchema.safeParseAsync(data);
  if (!parsed.success) return { success: false, error: "Invalid email or password" };

  const { email, password } = parsed.data;

  const header = await headers();
  try {
    return {
      success: true,
      data: await auth.api.signInEmail({
        body: { email, password },
        headers: header,
      }),
    };
  } catch (e: unknown) {
    console.error("Sign in error:", e instanceof Error ? e.message : "Something went wrong");
    return { success: false, error: e instanceof Error ? e.message : "Invalid email or password" };
  }
}

export async function signUpAction(data: SignUpFormData): Promise<Result<unknown>> {
  const parsed = await signUpSchema.safeParseAsync(data);

  if (!parsed.success) return { success: false, error: "Invalid input" };

  const { name, email, password } = parsed.data;

  const header = await headers();
  try {
    return {
      success: true,
      data: await auth.api.signUpEmail({
        body: { name, email, password },
        headers: header,
      }),
    };
  } catch (e: unknown) {
    console.error("Sign up error:", e instanceof Error ? e.message : "Something went wrong");
    return { success: false, error: e instanceof Error ? e.message : "Something went wrong" };
  }
}
