import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRefreshSession extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    userAgent: String,

    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired sessions.
refreshSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const RefreshSession: Model<IRefreshSession> =
  mongoose.models.RefreshSession ||
  mongoose.model<IRefreshSession>(
    "RefreshSession",
    refreshSessionSchema
  );