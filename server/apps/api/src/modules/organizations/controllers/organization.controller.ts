import type { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service.js";
import { sendCreated, sendSuccess } from "../../../shared/response/api-response.js";
export class OrganizationController {
  static async create(req: Request, res: Response) { return sendCreated(res, await OrganizationService.create(req.body)); }
  static async list(_req: Request, res: Response) { return sendSuccess(res, await OrganizationService.list()); }
  static async get(req: Request, res: Response) { return sendSuccess(res, await OrganizationService.get(String(req.params.id))); }
  static async update(req: Request, res: Response) { return sendSuccess(res, await OrganizationService.update(String(req.params.id), req.body)); }
  static async archive(req: Request, res: Response) { return sendSuccess(res, await OrganizationService.archive(String(req.params.id), req.body.version)); }
}
