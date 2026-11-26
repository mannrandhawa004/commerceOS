import type { Model } from "mongoose";
import { AppError } from "../errors/app-error.js";

export async function versionedUpdate(model: Model<any>, id: string, version: number, changes: Record<string, unknown>) {
  const updated = await model.findOneAndUpdate({ _id: id, version, status: "active" }, { $set: changes, $inc: { version: 1 } }, { new: true, runValidators: true });
  if (updated) return updated;
  const existing = await model.exists({ _id: id });
  if (!existing) throw new AppError("Resource not found", 404, "NOT_FOUND");
  throw new AppError("Resource was changed or archived", 409, "VERSION_CONFLICT");
}
