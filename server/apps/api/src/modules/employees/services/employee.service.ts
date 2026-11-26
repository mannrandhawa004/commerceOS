import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, RoleAssignment } from '../repositories/employee.repository.js';
import { Role } from '../../roles/models/role.model.js';
import { Organization } from '../../organizations/models/organization.model.js';
import { Store } from '../../stores/models/store.model.js';
import { RefreshSession } from '../../auth/models/refresh-session.model.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { preventSelfChange } from '../policies/employee.policy.js';

type NewEmployee = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
type Assignment = {
  roleId: string;
  scope: 'organization' | 'store';
  organizationId: string;
  storeIds: string[];
};
export class EmployeeService {
  static async create(input: NewEmployee) {
    const user = await User.create({
      ...input,
      isEmployee: true,
      password: await bcrypt.hash(input.password, 12),
    });
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
    };
  }
  static async list() {
    return User.find({ isEmployee: true })
      .select('-password')
      .sort({ firstName: 1 })
      .limit(100);
  }
  static async get(id: string) {
    const user = await User.findOne({ _id: id, isEmployee: true }).select(
      '-password',
    );
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    const assignments = await RoleAssignment.find({ userId: id }).select(
      '-__v',
    );
    return { user, assignments };
  }
  static async update(
    actorId: string,
    id: string,
    input: Record<string, unknown>,
  ) {
    preventSelfChange(actorId, id);
    if (
      await RoleAssignment.exists({
        userId: id,
        scope: 'global',
        roleId: (await Role.findOne({ slug: 'super-admin' }).select('_id'))
          ?._id,
      })
    )
      throw new AppError(
        'Cannot change a global administrator here',
        403,
        'FORBIDDEN',
      );
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await User.findOneAndUpdate(
          { _id: id, isEmployee: true },
          { $set: input },
          { new: true, runValidators: true, session },
        ).select('-password');
        if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
        if (input.status === 'inactive' || input.status === 'blocked') {
          await RefreshSession.updateMany(
            { userId: id, revokedAt: null },
            { $set: { revokedAt: new Date() } },
            { session },
          );
        }
        return user;
      });
    } finally {
      await session.endSession();
    }
  }
  static async assign(actorId: string, id: string, input: Assignment) {
    preventSelfChange(actorId, id);
    if (!(await User.exists({ _id: id, isEmployee: true, status: 'active' })))
      throw new AppError('Active employee not found', 404, 'NOT_FOUND');
    const role = await Role.findOne({ _id: input.roleId, isActive: true });
    if (!role || role.slug === 'super-admin' || role.slug === 'customer')
      throw new AppError('Invalid employee role', 400, 'INVALID_ROLE');
    if (
      !(await Organization.exists({
        _id: input.organizationId,
        status: 'active',
      }))
    )
      throw new AppError('Active organization not found', 404, 'NOT_FOUND');
    if (
      input.scope === 'store' &&
      (await Store.countDocuments({
        _id: { $in: input.storeIds },
        organizationId: input.organizationId,
        status: 'active',
      })) !== input.storeIds.length
    )
      throw new AppError(
        'Stores must be active and belong to the organization',
        400,
        'INVALID_STORE_SCOPE',
      );
    return RoleAssignment.create({ userId: id, ...input });
  }
  static async removeAssignment(
    actorId: string,
    id: string,
    assignmentId: string,
  ) {
    preventSelfChange(actorId, id);
    const result = await RoleAssignment.findOneAndDelete({
      _id: assignmentId,
      userId: id,
      scope: { $in: ['organization', 'store'] },
    });
    if (!result) throw new AppError('Assignment not found', 404, 'NOT_FOUND');
  }
}
