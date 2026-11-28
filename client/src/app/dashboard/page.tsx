'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { DashboardShell } from '@/shared/components/layout';

export default function DashboardPage() {
  const router = useRouter();
  const { user, status, initialized, error, loadSession, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!initialized) void loadSession().catch(() => undefined);
  }, [initialized, loadSession]);

  useEffect(() => {
    if (initialized && status === 'unauthenticated') router.replace('/login');
  }, [initialized, status, router]);

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // The thunk clears local state even when the BFF call fails.
    } finally {
      setSigningOut(false);
    }
  }

  const visibleError =
    error && initialized && status !== 'unauthenticated' ? error : undefined;

  return (
    <DashboardShell onLogout={() => void handleLogout()} busy={signingOut} error={visibleError}>
      {!user ? (
        <p className="loading">Loading your workspace…</p>
      ) : (
        <>
          <div className="form-kicker">
            <span className="kicker-line" /> YOUR WORKSPACE
          </div>
          <h1>
            Good to see you,
            <br />
            <em>{user.firstName}.</em>
          </h1>
          <p className="dashboard-intro">You&apos;re signed in and ready to get to work.</p>
          <section className="account-card">
            <div className="account-avatar">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <div className="account-label">SIGNED IN AS</div>
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <p>{user.email}</p>
            </div>
            <span className="account-status">
              <span />{' '}
              {user.status
                ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                : 'Active'}
            </span>
          </section>
          <div className="dashboard-note">
            <span>✓</span>
            <div>
              <strong>A little more room to grow.</strong>
              <p>
                Your CommerceOS workspace is ready. More tools will appear here as they become
                available.
              </p>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
