import { NextResponse } from 'next/server';
import { ERROR_CODES, type ErrorCode } from '@/shared/errors/error-codes';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/shared/types/api';

/** Consistent success envelope for Next.js route handlers. */
export function sendSuccess<T>(data: T, message = 'Request successful', status = 200) {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  return NextResponse.json(body, { status });
}

/** Consistent error envelope for Next.js route handlers. */
export function fail(
  message: string,
  status: number,
  code: ErrorCode = ERROR_CODES.REQUEST_FAILED,
  details?: unknown,
) {
  const body: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details === undefined ? {} : { details }),
    },
  };
  return NextResponse.json(body, { status });
}
