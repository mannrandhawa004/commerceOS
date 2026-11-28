import type { ReactNode } from 'react';
import { AuthShell as DesignedAuthShell } from '@/components/ui/auth-shell';

/**
 * Backwards-compatible wrapper. New code should import AuthShell from
 * `@/components/ui/auth-shell` directly so it can supply page-specific copy.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <DesignedAuthShell
      eyebrow="THE COMMERCE OPERATING SYSTEM"
      heading={
        <>
          Think fast,
          <br />
          Build faster
        </>
      }
      description="One workspace for everything it takes to run a better business."
      action={{ href: '/login', label: 'Sign in to your workspace' }}
    >
      {children}
    </DesignedAuthShell>
  );
}
