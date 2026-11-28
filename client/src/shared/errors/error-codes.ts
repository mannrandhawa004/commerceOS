/** Mirrors the error codes emitted by the Express API and the Next.js BFF. */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export function isErrorCode(value: string | undefined): value is ErrorCode {
  return Boolean(value && value in ERROR_CODES);
}
