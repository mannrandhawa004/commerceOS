'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[CommerceOS] Unhandled UI error:', error);
  }, [error]);

  return (
    <main className="dashboard">
      <div className="dashboard-content">
        <div className="form-kicker">
          <span className="kicker-line" /> SOMETHING WENT WRONG
        </div>
        <h1>We hit a snag.</h1>
        <p className="dashboard-intro">Please try again. If it keeps happening, check that the API is running.</p>
        <Button onClick={reset} trailing="→">
          Try again
        </Button>
      </div>
    </main>
  );
}
