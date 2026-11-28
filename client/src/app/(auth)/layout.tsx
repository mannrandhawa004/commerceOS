import type { ReactNode } from 'react';

/** Each auth page supplies its own AuthShell copy and CTA. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
