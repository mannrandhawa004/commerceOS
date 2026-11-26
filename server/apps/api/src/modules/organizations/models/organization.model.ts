import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
  currency: { type: String, required: true, uppercase: true, match: /^[A-Z]{3}$/ },
  timezone: { type: String, required: true },
  status: { type: String, enum: ["active", "archived"], default: "active" },
  version: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);
