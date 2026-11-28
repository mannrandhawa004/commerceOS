'use client';

import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

/** Public entry point used by the (auth) route pages. */
export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  return mode === 'register' ? <RegisterForm /> : <LoginForm />;
}
