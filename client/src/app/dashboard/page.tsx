'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brand } from '../../modules/auth/components/auth-shell';
import { authRequest, getSession } from '../../modules/auth/services/auth-client';
import type { UserProfile } from '../../modules/auth/types/auth';

export default function DashboardPage() {
  const router = useRouter(); const [user, setUser] = useState<UserProfile | null>(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; getSession().then(r => { if (active) setUser(r.data); }).catch(e => { if (active) { if (e.message === 'Session expired. Please sign in again.') router.replace('/login'); else setError(e.message); } }); return () => { active = false; }; }, [router]);
  async function logout() { setBusy(true); try { await authRequest('logout', {}); router.replace('/login'); router.refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not sign out.'); setBusy(false); } }
  return <main className="dashboard"><header className="dashboard-header"><Brand/><div className="header-right"><span className="online-dot"/> YOUR WORKSPACE <button className="signout" onClick={logout} disabled={busy}>Sign out <span>?</span></button></div></header><div className="dashboard-content">{error ? <div className="form-error" role="alert">{error}</div> : !user ? <p className="loading">Loading your workspace?</p> : <><div className="form-kicker"><span className="kicker-line"/> YOUR WORKSPACE</div><h1>Good to see you,<br/><em>{user.firstName}.</em></h1><p className="dashboard-intro">You?re signed in and ready to get to work.</p><section className="account-card"><div className="account-avatar">{user.firstName[0]}{user.lastName[0]}</div><div><div className="account-label">SIGNED IN AS</div><h2>{user.firstName} {user.lastName}</h2><p>{user.email}</p></div><span className="account-status"><span/> Active</span></section><div className="dashboard-note"><span>?</span><div><strong>A little more room to grow.</strong><p>Your CommerceOS workspace is ready. More tools will appear here as they become available.</p></div></div></>}</div><footer className="dashboard-footer">COMMERCEOS <span>?</span> BUILT FOR WHAT'S NEXT</footer></main>;
}
