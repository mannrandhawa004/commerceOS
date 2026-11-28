'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[CommerceOS] Dashboard error:', error);
  }, [error]);

  return (
    <main className="dashboard">
      <div className="dashboard-content">
        <h1>Your workspace couldn&apos;t load.</h1>
        <p className="dashboard-intro">Try again, or sign out and back in.</p>
        <Button onClick={reset} trailing="→">
          Retry
        </Button>
      </div>
    </main>
  );
}
