import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AuthFormLayoutProps {
  kicker: string;
  title: string;
  intro: string;
  footer: ReactNode;
  children: ReactNode;
}

/** Shared chrome for login, register and the post-registration state. */
export function AuthFormLayout({ kicker, title, intro, footer, children }: AuthFormLayoutProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-black/45 dark:text-white/45 2xl:text-[10px] 2xl:tracking-[0.22em]">
        <span className="h-px w-6 bg-black/25 dark:bg-white/25 2xl:w-7" aria-hidden="true" />
        {kicker}
      </div>

      <h1 className="mt-5 text-2xl font-medium tracking-[-0.04em] sm:text-3xl lg:text-[34px] lg:leading-[1.08] xl:text-[38px] 2xl:text-[50px] 2xl:leading-[1.05]">
        {title}
      </h1>
      <p className="mt-2 text-base leading-snug text-black/60 dark:text-white/55 sm:text-lg 2xl:mt-3 2xl:text-2xl">
        {intro}
      </p>

      <div className="mt-8 2xl:mt-12">{children}</div>

      <div className="mt-6 text-xs leading-5 text-black/45 dark:text-white/45 2xl:text-sm 2xl:leading-6">
        {footer}
      </div>

      <div className="mt-8 flex items-center gap-2 text-[11px] text-black/35 dark:text-white/35 2xl:text-xs">
        <Lock className="size-3 shrink-0 2xl:size-3.5" aria-hidden="true" />
        <span>Your workspace, securely yours.</span>
      </div>
    </div>
  );
}
