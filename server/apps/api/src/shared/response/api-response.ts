import type { Response } from "express";

import type {
  ApiSuccessResponse
} from "./response.types.js"

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Request successful",
  statusCode = 200
): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = "Resource created successfully"
): Response<ApiSuccessResponse<T>> {
  return sendSuccess(res, data, message, 201);
} 

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = "Data fetched successfully"
): Response<ApiSuccessResponse<T[]>> {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: pagination
  });
}

export function sendNoContent(
  res: Response
): Response {
  return res.status(204).send();
}