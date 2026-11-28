import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

/** Form-level error message. Renders nothing when empty. */
export function FormAlert({ children }: { children?: ReactNode }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-[10px] border border-red-500/30 bg-red-500/5 px-3.5 py-2.5 text-xs leading-5 text-red-800 dark:border-red-400/30 dark:bg-red-400/5 dark:text-red-200 2xl:gap-3 2xl:px-4 2xl:py-3 2xl:text-sm"
    >
      <AlertCircle className="mt-0.5 size-3.5 shrink-0 2xl:size-4" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
