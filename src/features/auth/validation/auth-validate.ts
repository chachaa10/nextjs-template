import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.email().max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .max(128, "Password is too long"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address").max(255, "Email is too long"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
