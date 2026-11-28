'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  getSessionThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from '../thunks/auth.thunks';
import type { LoginInput, RegisterInput } from '../types/auth';

/** Single entry point for auth state + actions in client components. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (input: LoginInput) => {
      await dispatch(loginThunk(input)).unwrap();
      router.replace('/dashboard');
      router.refresh();
    },
    [dispatch, router],
  );

  const register = useCallback(
    (input: RegisterInput) => dispatch(registerThunk(input)).unwrap(),
    [dispatch],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk()).unwrap();
    router.replace('/login');
    router.refresh();
  }, [dispatch, router]);

  const loadSession = useCallback(
    () => dispatch(getSessionThunk()).unwrap(),
    [dispatch],
  );

  return { ...auth, login, register, logout, loadSession };
}
