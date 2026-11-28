import { createAsyncThunk } from '@reduxjs/toolkit';
import { normalizeError } from '@/shared/errors/app-error';
import { authClient } from '../services/auth-client.service';
import {
  toSessionUser,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
  type SessionUser,
} from '../types/auth';

interface ThunkConfig {
  rejectValue: string;
}

const messageOf = (error: unknown) => normalizeError(error).message;

export const loginThunk = createAsyncThunk<SessionUser, LoginInput, ThunkConfig>(
  'auth/login',
  async (input, { rejectWithValue }) => {
    try {
      return toSessionUser(await authClient.login(input));
    } catch (error) {
      return rejectWithValue(messageOf(error));
    }
  },
);

export const registerThunk = createAsyncThunk<AuthUser, RegisterInput, ThunkConfig>(
  'auth/register',
  async (input, { rejectWithValue }) => {
    try {
      return await authClient.register(input);
    } catch (error) {
      return rejectWithValue(messageOf(error));
    }
  },
);

export const logoutThunk = createAsyncThunk<void, void, ThunkConfig>(
  'auth/logout',
  async (_input, { rejectWithValue }) => {
    try {
      await authClient.logout();
    } catch (error) {
      return rejectWithValue(messageOf(error));
    }
  },
);

export const getSessionThunk = createAsyncThunk<SessionUser, void, ThunkConfig>(
  'auth/getSession',
  async (_input, { rejectWithValue }) => {
    try {
      return toSessionUser(await authClient.session());
    } catch (error) {
      return rejectWithValue(messageOf(error));
    }
  },
);
