import { Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";
import {
  sendSuccess,
  sendCreated,
} from "../../../shared/response/api-response.js";

export class AuthController {
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);

    return sendCreated(
      res,
      "Account created successfully",
      user
    );
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(
      req.body,
      {
        userAgent: req.get("user-agent"),
        ipAddress: req.ip,
      }
    );

    return sendSuccess(
      res,
      "Login successful",
      result
    );
  }

  static async refresh(req: Request, res: Response) {
    const result = await AuthService.refresh(
      req.body.refreshToken,
      {
        userAgent: req.get("user-agent"),
        ipAddress: req.ip,
      }
    );

    return sendSuccess(
      res,
      "Token refreshed successfully",
      result
    );
  }

  static async logout(req: Request, res: Response) {
    const result = await AuthService.logout(
      req.body.refreshToken
    );

    return sendSuccess(
      res,
      result.message,
      null
    );
  }

  static async me(req: Request, res: Response) {
    const { User } = await import("../../users/models/user.model");

    const user = await User.findById(req.auth?.userId).select(
      "-password"
    );

    return sendSuccess(
      res,
      "User profile fetched successfully",
      user
    );
  }
}