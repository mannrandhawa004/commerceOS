import type {
  Request,
  Response,
  NextFunction
} from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { logger } from "../config/app.config.js";
import { AppError } from "../shared/errors/app-error.js";
import type { ApiErrorResponse } from "../shared/response/response.types.js";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // logger.error(error);

  if (res.headersSent) {
    return;
  }

  let statusCode = 500;
  let message = "Internal server error";
  let code = "INTERNAL_SERVER_ERROR";
  let details: unknown;

   // 1. Custom application errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  }

  // 2. Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Request validation failed";
    code = "VALIDATION_ERROR";

    details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
  }

   // 3. Mongoose validation errors
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Database validation failed";
    code = "VALIDATION_ERROR";

    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

   // 4. Invalid MongoDB ObjectId
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource identifier";
    code = "INVALID_ID";
  }

  // 5. MongoDB duplicate-key error
  else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    statusCode = 409;
    message = "Resource already exists";
    code = "DUPLICATE_RESOURCE";
  }

  // 6. Unknown errors
  else if (error instanceof Error) {
    logger.error(error);
  }

   const response: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details !== undefined && { details })
    }
  };

  // res.status(500).json({
  //   success: false,
  //   message:
  //     process.env.NODE_ENV === "production"
  //       ? "Internal server error"
  //       : error.message
  // });

   res.status(statusCode).json(response);
}