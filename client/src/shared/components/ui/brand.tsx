import Link from 'next/link';
import { cn } from '@/shared/utils/cn';

/** Shared brand mark. One definition, used by every layout. */
export function Brand({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      className={cn('brand', light && 'brand-light', className)}
      href="/login"
      aria-label="CommerceOS home"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>
        commerce<span className="brand-os">OS</span>
      </span>
    </Link>
  );
}
