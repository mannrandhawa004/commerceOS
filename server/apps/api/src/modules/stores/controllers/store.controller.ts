import type { Request, Response } from "express";
import { StoreService } from "../services/store.service.js";
import { sendCreated, sendSuccess } from "../../../shared/response/api-response.js";
export class StoreController {
  static async create(req: Request, res: Response) { return sendCreated(res, await StoreService.create(req.body)); }
  static async list(_req: Request, res: Response) { return sendSuccess(res, await StoreService.list()); }
  static async get(req: Request, res: Response) { return sendSuccess(res, await StoreService.get(String(req.params.id))); }
  static async update(req: Request, res: Response) { return sendSuccess(res, await StoreService.update(String(req.params.id), req.body)); }
  static async archive(req: Request, res: Response) { return sendSuccess(res, await StoreService.archive(String(req.params.id), req.body.version)); }
}
