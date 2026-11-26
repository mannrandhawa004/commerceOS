import { Store } from "../repositories/store.repository.js";
import { Organization } from "../../organizations/models/organization.model.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { versionedUpdate } from "../../../shared/utils/versioned-update.js";
import mongoose from "mongoose";

export class StoreService {
  static async create(input: { organizationId: string } & Record<string, unknown>) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Writing the organization serializes creation against organization archiving.
        const org = await Organization.findOneAndUpdate({ _id: input.organizationId, status: "active" }, { $inc: { version: 1 } }, { session });
        if (!org) throw new AppError("Active organization not found", 404, "NOT_FOUND");
        const [store] = await Store.create([input], { session });
        return store;
      });
    } finally { await session.endSession(); }
  }
  static list() { return Store.find().sort({ name: 1 }).limit(100); }
  static async get(id: string) {
    const item = await Store.findById(id);
    if (!item) throw new AppError("Store not found", 404, "NOT_FOUND");
    return item;
  }
  static update(id: string, input: { version: number } & Record<string, unknown>) {
    const { version, ...changes } = input;
    return versionedUpdate(Store, id, version, changes);
  }
  static archive(id: string, version: number) { return versionedUpdate(Store, id, version, { status: "archived" }); }
}
