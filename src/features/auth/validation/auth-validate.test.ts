import { describe, expect, test } from "vitest";
import { VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from "../const/test-constants.ts";
import { LoginSchema, signUpSchema } from "./auth-validate.ts";

describe("signUpSchema", () => {
  test("accepts valid input", () => {
    const result = signUpSchema.safeParse({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });
    expect(result.success).toBe(true);
  });

  test("rejects empty name", () => {
    const result = signUpSchema.safeParse({
      name: "",
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      name: VALID_NAME,
      email: "not-an-email",
      password: VALID_PASSWORD,
    });
    expect(result.success).toBe(false);
  });

  test("rejects short password", () => {
    const result = signUpSchema.safeParse({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: "1234567",
    });
    expect(result.success).toBe(false);
  });

  test("rejects long password", () => {
    const result = signUpSchema.safeParse({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });
});

describe("LoginSchema", () => {
  test("accepts valid input", () => {
    const result = LoginSchema.safeParse({
      email: VALID_EMAIL,
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty password", () => {
    const result = LoginSchema.safeParse({
      email: VALID_EMAIL,
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
