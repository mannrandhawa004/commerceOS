import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Shared brand mark, now expressed with the editorial-minimal Tailwind tokens. */
export function Brand({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      className={cn(
        'inline-flex w-max items-center gap-2 text-base font-medium tracking-[-0.04em] text-black dark:text-white 2xl:gap-2.5 2xl:text-[21px]',
        light && 'text-white dark:text-white',
        className,
      )}
      href="/login"
      aria-label="CommerceOS home"
    >
      <span className="grid size-7 grid-cols-2 gap-[3px] -rotate-6" aria-hidden="true">
        <span className="rounded-[2px] bg-current opacity-90" />
        <span className="rounded-[2px] bg-current opacity-45" />
        <span className="rounded-[2px] bg-current opacity-70" />
        <span className="rounded-[2px] bg-current" />
      </span>
      <span>
        commerce<span className="opacity-60">OS</span>
      </span>
    </Link>
  );
}
