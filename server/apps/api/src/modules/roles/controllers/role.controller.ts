import { Request, Response } from "express";

import { Role } from "../models/role.model.js";
import {
  sendCreated,
  sendSuccess,
} from "../../../shared/response/api-response.js";

export class RoleController {
  static async create(req: Request, res: Response) {
    const { name, slug, description, permissions } = req.body;

    const role = await Role.create({
      name,
      slug,
      description,
      permissions,
      isSystem: false,
    });

    return sendCreated(
      res,
      "Role created successfully",
      role
    );
  }

  static async getAll(_req: Request, res: Response) {
    const roles = await Role.find({
      isActive: true,
    });

    return sendSuccess(
      res,
      "Roles fetched successfully",
      roles
    );
  }
}