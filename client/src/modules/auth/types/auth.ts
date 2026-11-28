import type { ApiResponse } from '@/shared/types/api';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/** Shape returned by GET /auth/me. */
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string | null;
}

/** Normalised user stored in Redux, regardless of which endpoint supplied it. */
export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  createdAt?: string;
  lastLoginAt?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export type AuthApiResponse<T> = ApiResponse<T>;

export function toSessionUser(user: AuthUser | UserProfile): SessionUser {
  if ('id' in user) return { ...user };
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt ?? null,
  };
}
