import 'server-only';
import { z } from 'zod';

/**
 * Server-only environment configuration.
 * Validated once at startup so bad configuration fails loudly instead of
 * surfacing as mysterious 503s at runtime.
 */
const envSchema = z.object({
  COMMERCE_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
  COMMERCE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid client environment configuration:');
  console.error(result.error.flatten().fieldErrors);
  throw new Error('Invalid client environment configuration');
}

export const env = result.data;
export const isProduction = env.NODE_ENV === 'production';
