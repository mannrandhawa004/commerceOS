import { z } from 'zod';

/** Client-side mirror of the Express auth validators (plus confirmPassword). */
const firstName = z
  .string()
  .trim()
  .min(2, 'First name must be at least 2 characters.')
  .max(50, 'First name must be at most 50 characters.');

const lastName = z
  .string()
  .trim()
  .min(2, 'Last name must be at least 2 characters.')
  .max(50, 'Last name must be at most 50 characters.');

const email = z.string().trim().email('Enter a valid email address.').toLowerCase();

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .refine((value) => new TextEncoder().encode(value).length <= 72, {
    message: 'Password must be at most 72 bytes.',
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z.object({
  firstName,
  lastName,
  email,
  password,
});

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please re-enter your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });
