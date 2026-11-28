import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/modules/auth/slices/auth.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
});
