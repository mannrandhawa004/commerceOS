'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'quiet';
  trailing?: ReactNode;
}

/** Reusable action button built on the existing design-system classes. */
export function Button({
  variant = 'primary',
  trailing,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const trailingNode = trailing ? (
    <span aria-hidden="true">{trailing}</span>
  ) : null;

  if (variant === 'quiet') {
    return (
      <button type={type} className={cn('signout', className)} {...rest}>
        {children}
        {trailingNode}
      </button>
    );
  }

  return (
    <button type={type} className={cn('primary-button', className)} {...rest}>
      <span>{children}</span>
      {trailingNode}
    </button>
  );
}
