import { Organization } from "../repositories/organization.repository.js";
import { Store } from "../../stores/models/store.model.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { versionedUpdate } from "../../../shared/utils/versioned-update.js";
import mongoose from "mongoose";

export class OrganizationService {
  static create(input: Record<string, unknown>) { return Organization.create(input); }
  static list() { return Organization.find().sort({ name: 1 }).limit(100); }
  static async get(id: string) {
    const item = await Organization.findById(id);
    if (!item) throw new AppError("Organization not found", 404, "NOT_FOUND");
    return item;
  }
  static update(id: string, input: { version: number } & Record<string, unknown>) {
    const { version, ...changes } = input;
    return versionedUpdate(Organization, id, version, changes);
  }
  static async archive(id: string, version: number) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const org = await Organization.findOneAndUpdate({ _id: id, version, status: "active" }, { $set: { status: "archived" }, $inc: { version: 1 } }, { session, new: true });
        if (!org) {
          if (!await Organization.exists({ _id: id }).session(session)) throw new AppError("Organization not found", 404, "NOT_FOUND");
          throw new AppError("Organization was changed or archived", 409, "VERSION_CONFLICT");
        }
        if (await Store.exists({ organizationId: id, status: "active" }).session(session)) throw new AppError("Archive active stores first", 409, "ACTIVE_STORES");
        return org;
      });
    } finally { await session.endSession(); }
  }
}
