'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

/** Outlined field with the label on the trailing edge, matching the auth design language. */
function Field({ label, error, trailing, className, id, ...rest }: FieldProps) {
  const inputId = id ?? rest.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex h-12 items-center justify-between gap-3 rounded-[10px] border border-black/25 bg-white px-4 text-base leading-none transition-colors focus-within:border-black/60 dark:border-white/15 dark:bg-white/5 dark:focus-within:border-white/50 2xl:h-14 2xl:gap-4 2xl:px-5 2xl:text-lg',
          error && 'border-red-500/60 focus-within:border-red-500/70 dark:border-red-400/60',
        )}
      >
        <input
          id={inputId}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/35',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {trailing}
        <label
          htmlFor={inputId}
          className="shrink-0 cursor-text text-sm text-black/45 dark:text-white/45 2xl:text-base"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs leading-5 text-red-700 dark:text-red-300 2xl:mt-2 2xl:text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField(props: FieldProps) {
  return <Field {...props} />;
}

export function PasswordField(props: Omit<FieldProps, 'type' | 'trailing'>) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="shrink-0 rounded-sm p-1 text-black/35 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white"
        >
          {visible ? (
            <EyeOff className="size-3.5 2xl:size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-3.5 2xl:size-4" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
