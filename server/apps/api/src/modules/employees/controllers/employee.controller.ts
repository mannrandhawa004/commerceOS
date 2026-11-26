import type { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service.js';
import {
  sendCreated,
  sendNoContent,
  sendSuccess,
} from '../../../shared/response/api-response.js';
export class EmployeeController {
  static async create(req: Request, res: Response) {
    return sendCreated(res, await EmployeeService.create(req.body));
  }
  static async list(_req: Request, res: Response) {
    return sendSuccess(res, await EmployeeService.list());
  }
  static async get(req: Request, res: Response) {
    return sendSuccess(res, await EmployeeService.get(String(req.params.id)));
  }
  static async update(req: Request, res: Response) {
    return sendSuccess(
      res,
      await EmployeeService.update(
        req.auth!.userId,
        String(req.params.id),
        req.body,
      ),
    );
  }
  static async assign(req: Request, res: Response) {
    return sendCreated(
      res,
      await EmployeeService.assign(
        req.auth!.userId,
        String(req.params.id),
        req.body,
      ),
    );
  }
  static async removeAssignment(req: Request, res: Response) {
    await EmployeeService.removeAssignment(
      req.auth!.userId,
      String(req.params.id),
      String(req.params.assignmentId),
    );
    return sendNoContent(res);
  }
}
