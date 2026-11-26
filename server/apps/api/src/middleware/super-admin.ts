import { RoleAssignment } from '../modules/role-assignments/models/role-assignment.model.js';
import { Role } from '../modules/roles/models/role.model.js';
import { AppError } from '../shared/errors/app-error.js';
import { asyncHandler } from '../shared/utils/async-handler.js';

// Until scoped authorization is implemented, management is limited to a global administrator.
export const requireSuperAdmin = asyncHandler(async (req, _res, next) => {
  const role = await Role.findOne({
    slug: 'super-admin',
    isSystem: true,
    isActive: true,
  }).select('_id');

  const assignment =
    role &&
    req.auth &&
    (await RoleAssignment.exists({
      userId: req.auth.userId,
      roleId: role._id,
      scope: 'global',
    }));
    
  if (!assignment)
    throw new AppError(
      'Global administrator access required',
      403,
      'FORBIDDEN',
    );
  next();
});
