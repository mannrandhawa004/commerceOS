import { Request, Response, NextFunction } from "express";

import { RoleAssignment } from "../modules/role-assignments/models/role-assignment.model.js";
import { Role } from "../modules/roles/models/role.model.js";

import { AppError } from "../shared/errors/app-error.js";
import { asyncHandler } from "../shared/utils/async-handler.js";

export const authorize = (requiredPermission: string) =>
  asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.auth?.userId) {
        throw new AppError(
          "Authentication required",
          401,
          "UNAUTHORIZED"
        );
      }

      const assignments = await RoleAssignment.find({
        userId: req.auth.userId,
      }).populate({
        path: "roleId",
        model: Role,
        match: { isActive: true },
      });

      const hasPermission = assignments.some((assignment) => {
        const role = assignment.roleId as unknown as {
          permissions: string[];
        } | null;

        if (!role) return false;

        return role.permissions.includes(requiredPermission);
      });

      if (!hasPermission) {
        throw new AppError(
          "You do not have permission to perform this action",
          403,
          "FORBIDDEN"
        );
      }

      next();
    }
  );