import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),

    email: z.string().trim().email().toLowerCase(),

    password: z.string().min(8).refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password must be at most 72 bytes"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const logoutSchema = refreshSchema;