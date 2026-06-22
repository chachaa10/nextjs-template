import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.email("Invalid email address").min(1, "Email is required").max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    )
    .max(128, "Password is too long"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address").max(255, "Email is too long"),
  password: z.string().min(1, "Password is required"),
});
