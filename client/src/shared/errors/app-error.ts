import { ERROR_CODES, isErrorCode, type ErrorCode } from './error-codes';

interface AppErrorOptions {
  code?: ErrorCode;
  status?: number;
  details?: unknown;
}

/** Client-side error primitive. Never contains tokens or raw response bodies. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.code = options.code ?? ERROR_CODES.REQUEST_FAILED;
    this.status = options.status ?? 0;
    this.details = options.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** Converts unknown thrown values (including thunk rejectValues) into AppError. */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (typeof error === 'string') return new AppError(error);
  if (error instanceof Error) {
    return new AppError(error.message || 'Something went wrong. Please try again.');
  }
  return new AppError('Something went wrong. Please try again.');
}

/** Builds an AppError from a failed API envelope. */
export function errorFromResponse(
  message: string,
  status: number,
  code?: string,
  details?: unknown,
): AppError {
  return new AppError(message || 'Something went wrong. Please try again.', {
    code: isErrorCode(code) ? code : ERROR_CODES.REQUEST_FAILED,
    status,
    details,
  });
}
