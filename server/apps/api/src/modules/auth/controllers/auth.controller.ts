import type { Request, Response } from "express";

import { User } from "../../users/models/user.model.js";
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
      user,
      "Account created successfully"
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
      result,
      "Login successful"
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
      result,
      "Token refreshed successfully"
    );
  }

  static async logout(req: Request, res: Response) {
    const result = await AuthService.logout(
      req.body.refreshToken
    );

    return sendSuccess(
      res,
      null,
      result.message
    );
  }

  static async me(req: Request, res: Response) {
    const user = await User.findById(req.auth?.userId).select(
      "-password"
    );

    return sendSuccess(
      res,
      user,
      "User profile fetched successfully"
    );
  }
}