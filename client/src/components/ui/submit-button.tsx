'use client';

import { ArrowRight, LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  busy?: boolean;
  children: ReactNode;
}

/** High-contrast primary action used by the auth forms. */
export function SubmitButton({ busy = false, disabled, className, children, ...rest }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className={cn(
        'mt-7 flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-black/40 bg-black px-4 text-base font-medium text-white transition-colors hover:bg-black/85 disabled:cursor-wait disabled:opacity-70 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85 2xl:mt-9 2xl:h-12 2xl:gap-3 2xl:px-5 2xl:text-lg',
        className,
      )}
      {...rest}
    >
      {busy ? <LoaderCircle className="size-4 shrink-0 animate-spin 2xl:size-5" aria-hidden="true" /> : null}
      <span>{children}</span>
      {!busy ? <ArrowRight className="size-4 shrink-0 2xl:size-5" aria-hidden="true" /> : null}
    </button>
  );
}
