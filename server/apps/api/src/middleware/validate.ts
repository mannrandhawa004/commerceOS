import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: {
          code: "VALIDATION_ERROR",
          details: result.error.flatten(),
        },
      });
      return;
    }

    const data = result.data as { body?: unknown };
    req.body = data.body ?? req.body;

    next();
  };