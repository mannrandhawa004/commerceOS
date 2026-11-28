'use client';

import type { ReactNode } from 'react';
import { Alert } from '@/shared/components/ui/alert';
import { Brand } from '@/shared/components/ui/brand';
import { Button } from '@/shared/components/ui/button';

interface DashboardShellProps {
  children: ReactNode;
  onLogout: () => void;
  busy?: boolean;
  error?: string;
}

/** Reusable page chrome for authenticated screens. */
export function DashboardShell({ children, onLogout, busy = false, error }: DashboardShellProps) {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <Brand />
        <div className="header-right">
          <span className="online-dot" /> YOUR WORKSPACE
          <Button variant="quiet" onClick={onLogout} disabled={busy}>
            Sign out<span>→</span>
          </Button>
        </div>
      </header>
      <div className="dashboard-content">{error ? <Alert>{error}</Alert> : children}</div>
      <footer className="dashboard-footer">
        COMMERCEOS <span>©</span> BUILT FOR WHAT&apos;S NEXT
      </footer>
    </main>
  );
}
