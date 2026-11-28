'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Extra control rendered inside the input wrapper (e.g. show/hide password). */
  trailing?: ReactNode;
}

/** Labelled input with accessible inline validation feedback. */
export function InputField({ label, error, trailing, className, id, ...rest }: InputFieldProps) {
  const inputId = id ?? rest.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  const input = (
    <input
      id={inputId}
      className={cn(error && 'input-error', className)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : undefined}
      {...rest}
    />
  );

  return (
    <label htmlFor={inputId}>
      <span>{label}</span>
      {trailing ? <span className="password-wrap">{input}{trailing}</span> : input}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
