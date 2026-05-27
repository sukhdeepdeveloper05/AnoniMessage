import z from "zod";

export const signInSchema = z.object({
  identifier: z.string().regex(/^[a-zA-Z0-9_@.]+$/, "Invalid username or email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
