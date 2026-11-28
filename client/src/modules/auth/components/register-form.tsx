'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AuthFormLayout, FormAlert, PasswordField, SubmitButton, TextField } from '@/components/ui';
import { useZodForm } from '@/shared/hooks/use-zod-form';
import { useAuth } from '../hooks/use-auth';
import { registerFormSchema } from '../validators/auth.validator';

export function RegisterForm() {
  const { register } = useAuth();
  const [created, setCreated] = useState(false);

  const form = useZodForm({
    schema: registerFormSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      setCreated(true);
    },
  });

  if (created) {
    return (
      <AuthFormLayout
        kicker="ACCOUNT CREATED"
        title="You're all set."
        intro="Your account is ready. Sign in to get started with CommerceOS."
        footer={<span>Welcome to CommerceOS.</span>}
      >
        <Link
          className="mt-7 flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-black/40 bg-black px-4 text-base font-medium text-white transition-colors hover:bg-black/85 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85 2xl:mt-9 2xl:h-12 2xl:gap-3 2xl:px-5 2xl:text-lg"
          href="/login"
        >
          Continue to sign in
          <ArrowRight className="size-4 shrink-0 2xl:size-5" aria-hidden="true" />
        </Link>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      kicker="GET STARTED"
      title="Let's get started."
      intro="Create your account and make space for better business."
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-black underline underline-offset-2 transition-colors hover:text-black/60 dark:text-white dark:hover:text-white/60"
          >
            Sign in
            <ArrowRight className="ml-1 inline size-3 align-[-2px] 2xl:size-3.5" aria-hidden="true" />
          </Link>
        </>
      }
    >
      <form className="space-y-4 2xl:space-y-5" onSubmit={form.handleSubmit} noValidate>
        <FormAlert>{form.formError}</FormAlert>
        <div className="grid gap-4 sm:grid-cols-2 2xl:gap-5">
          <TextField
            label="First name"
            placeholder="Asha"
            autoComplete="given-name"
            required
            error={form.errors.firstName}
            {...form.getFieldProps('firstName')}
          />
          <TextField
            label="Last name"
            placeholder="Sharma"
            autoComplete="family-name"
            required
            error={form.errors.lastName}
            {...form.getFieldProps('lastName')}
          />
        </div>
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          error={form.errors.password}
          {...form.getFieldProps('password')}
        />
        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          error={form.errors.confirmPassword}
          {...form.getFieldProps('confirmPassword')}
        />
        <SubmitButton busy={form.submitting}>
          {form.submitting ? 'Creating account…' : 'Create account'}
        </SubmitButton>
      </form>
    </AuthFormLayout>
  );
}
