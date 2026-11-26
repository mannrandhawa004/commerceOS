import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoleAssignment extends Document {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;

  scope: "global" | "organization" | "store";

  organizationId?: mongoose.Types.ObjectId | null;
  storeIds: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const roleAssignmentSchema = new Schema<IRoleAssignment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    scope: {
      type: String,
      enum: ["global", "organization", "store"],
      default: "global",
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    storeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
  },
  {
    timestamps: true,
  }
);

roleAssignmentSchema.index({
  userId: 1,
  roleId: 1,
  organizationId: 1,
});

// One assignment per employee, role, organization and scope. Store IDs are managed as a set.
roleAssignmentSchema.index(
  { userId: 1, roleId: 1, organizationId: 1, scope: 1 },
  { unique: true, partialFilterExpression: { scope: { $in: ["organization", "store"] } } }
);

export const RoleAssignment: Model<IRoleAssignment> =
  mongoose.models.RoleAssignment ||
  mongoose.model<IRoleAssignment>(
    "RoleAssignment",
    roleAssignmentSchema
  );
