import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { User } from '../../users/models/user.model.js';
import { Role } from '../../roles/models/role.model.js';
import { RoleAssignment } from '../../role-assignments/models/role-assignment.model.js';
import { RefreshSession } from '../models/refresh-session.model.js';

import { AppError } from '../../../shared/errors/app-error.js';
import { generateAccessToken } from '../../../shared/utils/tokenGenration.js';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SessionMetadata {
  userAgent?: string;
  ipAddress?: string;
}

const REFRESH_TOKEN_DAYS = 30;
const refreshExpiresAt = () =>
  new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');
const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

const createSession = async (userId: string, metadata: SessionMetadata) => {
  const refreshToken = generateRefreshToken();

  const expiresAt = refreshExpiresAt();

  const session = await RefreshSession.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt,
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
  });

  const accessToken = generateAccessToken(userId, session.id);

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
};

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await User.exists({
      email: input.email,
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409, 'DUPLICATE_RESOURCE');
    }
    
    // It check for role is that role is active , so we can assign it to normal user 
    const customerRole = await Role.findOne({
      slug: 'customer',
      isActive: true,
    });
    if (!customerRole) {
      throw new AppError(
        'Customer role is not configured',
        503,
        'ROLE_NOT_CONFIGURED',
      );
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: hashedPassword,
    });
    
    try {
      await RoleAssignment.create({
        userId: user._id,
        roleId: customerRole._id,
        scope: 'global',
        storeIds: [],
      });
    } catch (error) {
      await User.deleteOne({ _id: user._id });
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  static async login(input: LoginInput, metadata: SessionMetadata) {
    const user = await User.findOne({
      email: input.email,
    }).select('+password');

    if (!user) {
      throw new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS',
      );
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS',
      );
    }

    if (user.status !== 'active') {
      throw new AppError('Your account is not active', 403, 'ACCOUNT_INACTIVE');
    }

    const tokens = await createSession(user.id, metadata);

    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      ...tokens,
    };
  }

  static async refresh(oldRefreshToken: string, metadata: SessionMetadata) {
    const tokenHash = hashToken(oldRefreshToken);

    const session = await RefreshSession.findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!session) {
      throw new AppError(
        'Invalid or expired refresh token',
        401,
        'INVALID_REFRESH_TOKEN',
      );
    }

    const user = await User.findById(session.userId).select('status').lean();

    if (!user || user.status !== 'active') {
      await RefreshSession.updateOne(
        { _id: session._id },
        { $set: { revokedAt: new Date() } },
      );

      throw new AppError('User account is not active', 401, 'ACCOUNT_INACTIVE');
    }

    // Rotate the refresh token atomically.
    const newRefreshToken = generateRefreshToken();

    const newExpiresAt = refreshExpiresAt();

    const updatedSession = await RefreshSession.findOneAndUpdate(
      {
        _id: session._id,
        tokenHash,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: {
          tokenHash: hashToken(newRefreshToken),
          expiresAt: newExpiresAt,
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress,
        },
      },
      { new: true },
    );

    if (!updatedSession) {
      throw new AppError(
        'Refresh token has already been used',
        401,
        'REFRESH_TOKEN_REUSED',
      );
    }

    return {
      accessToken: generateAccessToken(user._id.toString(), updatedSession.id),
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt,
    };
  }

  static async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    await RefreshSession.updateOne(
      {
        tokenHash,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );

    return { message: 'Logged out successfully' };
  }
}
