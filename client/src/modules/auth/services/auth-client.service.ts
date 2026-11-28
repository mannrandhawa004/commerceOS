'use client';

import { getApiResponse } from '@/shared/api/axios-browser';
import { AUTH_ACTIONS } from '../constants/auth.constants';
import type { AuthUser, LoginInput, RegisterInput, UserProfile } from '../types/auth';

/** Browser -> Next.js BFF. Cookies are handled by the browser, not here. */
export const authClient = {
  async login(input: LoginInput): Promise<AuthUser> {
    const result = await getApiResponse<{ user: AuthUser }>({
      method: 'POST',
      url: `/auth/${AUTH_ACTIONS.login}`,
      data: input,
    });
    return result.data.user;
  },

  async register(input: RegisterInput): Promise<AuthUser> {
    const result = await getApiResponse<AuthUser>({
      method: 'POST',
      url: `/auth/${AUTH_ACTIONS.register}`,
      data: input,
    });
    return result.data;
  },

  async logout(): Promise<void> {
    await getApiResponse<null>({
      method: 'POST',
      url: `/auth/${AUTH_ACTIONS.logout}`,
      data: {},
    });
  },

  async session(): Promise<UserProfile> {
    const result = await getApiResponse<UserProfile>({
      method: 'GET',
      url: `/auth/${AUTH_ACTIONS.session}`,
    });
    return result.data;
  },
};
