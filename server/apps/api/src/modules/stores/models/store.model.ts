import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true, immutable: true },
  code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ["active", "archived"], default: "active" },
  version: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
storeSchema.index({ organizationId: 1, code: 1 }, { unique: true });
export const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
