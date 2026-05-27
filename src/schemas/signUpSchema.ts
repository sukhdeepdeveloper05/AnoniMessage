import z from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters long")
  .max(12, "Username must be at most 12 characters long")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must contain only letters, numbers, and underscores"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .email("Invalid email address")
    .regex(/.+@.+\..+/i, "Email must be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
