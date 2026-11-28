import 'server-only';

import type { NextResponse } from 'next/server';
import { ACCESS_TOKEN_MAX_AGE, COOKIE_NAMES } from '@/config/app.config';
import { isProduction } from '@/config/env';
import { backendRequest, type BackendResult } from '@/shared/api/axios-server';
import type { AuthUser, LoginInput, RegisterInput, TokenResponse, UserProfile } from '../types/auth';

export const accessCookie = COOKIE_NAMES.accessToken;
export const refreshCookie = COOKIE_NAMES.refreshToken;

/** BFF -> Express integration and HttpOnly cookie management. */
export const authServer = {
  register(input: RegisterInput): Promise<BackendResult<AuthUser>> {
    return backendRequest<AuthUser>({ method: 'POST', url: '/auth/register', data: input });
  },

  login(input: LoginInput): Promise<BackendResult<TokenResponse & { user: AuthUser }>> {
    return backendRequest<TokenResponse & { user: AuthUser }>({
      method: 'POST',
      url: '/auth/login',
      data: input,
    });
  },

  logout(refreshToken: string): Promise<BackendResult<null>> {
    return backendRequest<null>({
      method: 'POST',
      url: '/auth/logout',
      data: { refreshToken },
    });
  },

  me(accessToken: string): Promise<BackendResult<UserProfile>> {
    return backendRequest<UserProfile>({
      method: 'GET',
      url: '/auth/me',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  refresh(refreshToken: string): Promise<BackendResult<TokenResponse>> {
    return backendRequest<TokenResponse>({
      method: 'POST',
      url: '/auth/refresh',
      data: { refreshToken },
    });
  },
};

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export function setSession(response: NextResponse, tokens: TokenResponse): void {
  response.cookies.set(accessCookie, tokens.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(refreshCookie, tokens.refreshToken, {
    ...cookieOptions,
    expires: new Date(tokens.expiresAt),
  });
}

export function clearSession(response: NextResponse): void {
  response.cookies.set(accessCookie, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set(refreshCookie, '', { ...cookieOptions, maxAge: 0 });
}
