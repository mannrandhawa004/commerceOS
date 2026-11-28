'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AuthFormLayout, FormAlert, PasswordField, SubmitButton, TextField } from '@/components/ui';
import { useZodForm } from '@/shared/hooks/use-zod-form';
import { useAuth } from '../hooks/use-auth';
import { loginSchema } from '../validators/auth.validator';

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
          <Link
            href="/register"
            className="font-medium text-black underline underline-offset-2 transition-colors hover:text-black/60 dark:text-white dark:hover:text-white/60"
          >
            Create an account
            <ArrowRight className="ml-1 inline size-3 align-[-2px] 2xl:size-3.5" aria-hidden="true" />
          </Link>
        </>
      }
    >
      <form className="space-y-4 2xl:space-y-5" onSubmit={form.handleSubmit} noValidate>
        <FormAlert>{form.formError}</FormAlert>
        <TextField
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
        <SubmitButton busy={form.submitting}>
          {form.submitting ? 'Signing in…' : 'Sign in to your workspace'}
        </SubmitButton>
      </form>
    </AuthFormLayout>
  );
}
