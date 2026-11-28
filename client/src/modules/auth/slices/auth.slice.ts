import { createSlice } from '@reduxjs/toolkit';
import {
  getSessionThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from '../thunks/auth.thunks';
import type { SessionUser } from '../types/auth';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: SessionUser | null;
  status: AuthStatus;
  /** True once the first session check has settled. */
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetAuth() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
        state.initialized = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
      })
      .addCase(registerThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to create your account. Please try again.';
      })
      .addCase(getSessionThunk.pending, (state) => {
        if (state.status !== 'authenticated') state.status = 'loading';
      })
      .addCase(getSessionThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
        state.initialized = true;
        state.error = null;
      })
      .addCase(getSessionThunk.rejected, (state, action) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.initialized = true;
        state.error = action.payload ?? null;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.initialized = true;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        // Local session is gone even if the BFF call failed.
        state.user = null;
        state.status = 'unauthenticated';
        state.initialized = true;
        state.error = action.payload ?? null;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
