import { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { RefreshSession } from "../modules/auth/models/refresh-session.model.js";
import { User } from "../modules/users/models/user.model.js";
import { AppError } from "../shared/errors/app-error.js";
import { asyncHandler } from "../shared/utils/async-handler.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(
        "Authentication required",
        401,
        "UNAUTHORIZED"
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      const result = jwt.verify(token, ACCESS_TOKEN_SECRET, {
        issuer: "commerce-os-api",
        audience: "commerce-os-client",
      });

      if (
        typeof result === "string" ||
        typeof result.sub !== "string" ||
        typeof result.sid !== "string"
      ) {
        throw new Error("Invalid token payload");
      }

      decoded = result;
    } catch {
      throw new AppError(
        "Invalid or expired access token",
        401,
        "INVALID_ACCESS_TOKEN"
      );
    }

    const [session, user] = await Promise.all([
      RefreshSession.findOne({
        _id: decoded.sid,
        userId: decoded.sub,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      }),

      User.findById(decoded.sub),
    ]);

    if (!session || !user || user.status !== "active") {
      throw new AppError(
        "Session is invalid",
        401,
        "INVALID_SESSION"
      );
    }

    req.auth = {
      userId: user.id,
      sessionId: session.id,
    };

    next();
  }
);