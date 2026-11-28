'use client';

import Link from 'next/link';
import { Alert, Button, InputField, PasswordField } from '@/shared/components/ui';
import { useZodForm } from '@/shared/hooks/use-zod-form';
import { useAuth } from '../hooks/use-auth';
import { loginSchema } from '../validators/auth.validator';
import { AuthFormLayout } from './auth-form-layout';

export function LoginForm() {
  const { login } = useAuth();
  const form = useZodForm({
    schema: loginSchema,
    initialValues: { email: '', password: '' },
    onSubmit: (values) => login(values),
  });

  return (
    <AuthFormLayout
      kicker="WELCOME BACK"
      title="Welcome back."
      intro="Sign in to pick up right where you left off."
      footer={
        <>
          New to CommerceOS?{' '}
          <Link href="/register">
            Create an account <span>→</span>
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
        <Alert>{form.formError}</Alert>
        <InputField
          label="Email address"
          type="email"
          placeholder="you@yourbusiness.com"
          autoComplete="email"
          required
          error={form.errors.email}
          {...form.getFieldProps('email')}
        />
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={form.errors.password}
          {...form.getFieldProps('password')}
        />
        <Button type="submit" disabled={form.submitting} trailing="→">
          {form.submitting ? 'Signing in…' : 'Sign in to your workspace'}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
