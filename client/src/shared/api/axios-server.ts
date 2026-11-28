import 'server-only';

import axios, { type AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { ERROR_CODES } from '@/shared/errors/error-codes';
import type { ApiResponse } from '@/shared/types/api';

/**
 * BFF -> Express client. Runs only inside Next.js route handlers and never
 * receives browser cookies implicitly; tokens are passed explicitly per call.
 */
const backendClient = axios.create({
  baseURL: env.COMMERCE_API_URL,
  timeout: env.COMMERCE_API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  // Forward upstream status + envelope to the caller instead of throwing.
  validateStatus: () => true,
});

export interface BackendResult<T> {
  status: number;
  payload: ApiResponse<T>;
}

const unreachable = (): BackendResult<never> => ({
  status: 503,
  payload: {
    success: false,
    message: 'Unable to reach the authentication service. Please try again.',
    error: { code: ERROR_CODES.REQUEST_FAILED },
  },
});

export async function backendRequest<T>(config: AxiosRequestConfig): Promise<BackendResult<T>> {
  try {
    const response = await backendClient.request<ApiResponse<T>>(config);
    return { status: response.status, payload: response.data };
  } catch {
    return unreachable();
  }
}
