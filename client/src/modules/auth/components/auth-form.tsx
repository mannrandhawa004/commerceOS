'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authRequest } from '../services/auth-client';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register'; const router = useRouter();
  const [pending, setPending] = useState(false); const [error, setError] = useState(''); const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); const values = new FormData(event.currentTarget);
    const email = String(values.get('email') || '').trim(); const password = String(values.get('password') || '');
    if (register && new TextEncoder().encode(password).length > 72) { setError('Password must be at most 72 bytes.'); return; }
    if (register && password !== values.get('confirmPassword')) { setError('Passwords do not match.'); return; }
    setPending(true);
    try {
      if (register) { await authRequest('register', { firstName: String(values.get('firstName') || '').trim(), lastName: String(values.get('lastName') || '').trim(), email, password }); setRegistered(true); }
      else { await authRequest('login', { email, password }); router.replace('/dashboard'); router.refresh(); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); } finally { setPending(false); }
  }
  if (registered) return <div className="form-inner"><div className="form-kicker"><span className="kicker-line"/> ACCOUNT CREATED</div><h2>You're all set.</h2><p className="form-intro">Your account is ready. Sign in to get started with CommerceOS.</p><Link className="primary-button success-link" href="/login">Continue to sign in <span>?</span></Link></div>;
  return <div className="form-inner"><div className="form-kicker"><span className="kicker-line"/> {register ? 'GET STARTED' : 'WELCOME BACK'}</div>
    <h2>{register ? 'Let?s get started.' : 'Welcome back.'}</h2><p className="form-intro">{register ? 'Create your account and make space for better business.' : 'Sign in to pick up right where you left off.'}</p>
    <form onSubmit={submit} className="auth-form">
      {error && <div className="form-error" role="alert">{error}</div>}
      {register && <div className="field-row"><label>First name<input name="firstName" placeholder="Asha" required minLength={2} maxLength={50} autoComplete="given-name" /></label><label>Last name<input name="lastName" placeholder="Sharma" required minLength={2} maxLength={50} autoComplete="family-name" /></label></div>}
      <label>Email address<input name="email" type="email" placeholder="you@yourbusiness.com" required autoComplete="email" /></label>
      <label>Password<span className="password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} placeholder={register ? 'At least 8 characters' : 'Enter your password'} required minLength={register ? 8 : 1} autoComplete={register ? 'new-password' : 'current-password'} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
      {register && <label>Confirm password<input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Re-enter your password" required minLength={8} autoComplete="new-password" /></label>}
      <button className="primary-button" disabled={pending} type="submit">{pending ? (register ? 'Creating account?' : 'Signing in?') : (register ? 'Create account' : 'Sign in to your workspace')}<span aria-hidden="true">?</span></button>
    </form><div className="switch-auth">{register ? 'Already have an account?' : 'New to CommerceOS?'} <Link href={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'} <span>?</span></Link></div>
    <div className="secure-note"><span className="lock-icon">?</span><span>Your workspace, securely yours.</span></div>
  </div>;
}
