import type { Request, Response, NextFunction } from "express";
import { type JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { verifyAccessToken } from "../shared/utils/tokenGenration.js";

import { RefreshSession } from "../modules/auth/models/refresh-session.model.js";
import { User } from "../modules/users/models/user.model.js";
import { AppError } from "../shared/errors/app-error.js";
import { asyncHandler } from "../shared/utils/async-handler.js";

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
      decoded = verifyAccessToken(token);
      if (!mongoose.isValidObjectId(decoded.sub) || !mongoose.isValidObjectId(decoded.sid)) {
        throw new Error("Invalid token identifiers");
      }
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