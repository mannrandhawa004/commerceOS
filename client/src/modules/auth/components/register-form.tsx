'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Button, InputField, PasswordField } from '@/shared/components/ui';
import { useZodForm } from '@/shared/hooks/use-zod-form';
import { useAuth } from '../hooks/use-auth';
import { registerFormSchema } from '../validators/auth.validator';
import { AuthFormLayout } from './auth-form-layout';

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
        <Link className="primary-button success-link" href="/login">
          Continue to sign in <span>→</span>
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
          <Link href="/login">
            Sign in <span>→</span>
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
        <Alert>{form.formError}</Alert>
        <div className="field-row">
          <InputField
            label="First name"
            placeholder="Asha"
            autoComplete="given-name"
            required
            error={form.errors.firstName}
            {...form.getFieldProps('firstName')}
          />
          <InputField
            label="Last name"
            placeholder="Sharma"
            autoComplete="family-name"
            required
            error={form.errors.lastName}
            {...form.getFieldProps('lastName')}
          />
        </div>
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
        <Button type="submit" disabled={form.submitting} trailing="→">
          {form.submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
