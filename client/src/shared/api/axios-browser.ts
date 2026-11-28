'use client';

import axios, { type AxiosRequestConfig } from 'axios';
import { AppError, errorFromResponse, normalizeError } from '@/shared/errors/app-error';
import { ERROR_CODES } from '@/shared/errors/error-codes';
import type { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/shared/types/api';

const NETWORK_MESSAGE = 'Unable to connect. Please check your connection and try again.';
const TIMEOUT_MESSAGE = 'The request took too long. Please try again.';

/**
 * Browser-side client. Talks ONLY to the same-origin Next.js BFF (/api/*),
 * so session cookies stay HttpOnly and never reach JavaScript.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,
});

function isFailure(payload: unknown): payload is ApiErrorResponse {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      (payload as { success?: unknown }).success === false,
  );
}

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>;
    if (isFailure(payload)) {
      throw errorFromResponse(payload.message, response.status, payload.error.code, payload.error.details);
    }
    return response;
  },
  (error: unknown) => {
    if (error instanceof AppError) return Promise.reject(error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      if (isFailure(error.response?.data)) {
        const payload = error.response.data;
        return Promise.reject(errorFromResponse(payload.message, status, payload.error.code, payload.error.details));
      }
      if (!error.response) {
        return Promise.reject(new AppError(NETWORK_MESSAGE, { code: ERROR_CODES.NETWORK_ERROR }));
      }
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new AppError(TIMEOUT_MESSAGE, { code: ERROR_CODES.NETWORK_ERROR, status }));
      }
      return Promise.reject(errorFromResponse('Something went wrong. Please try again.', status));
    }

    return Promise.reject(normalizeError(error));
  },
);

/** Returns the unwrapped success envelope; failures are thrown as AppError. */
export async function getApiResponse<T>(config: AxiosRequestConfig): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.request<ApiSuccessResponse<T>>(config);
  return response.data;
}
