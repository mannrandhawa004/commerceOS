import type { ReactNode } from 'react';

interface AuthFormLayoutProps {
  kicker: string;
  title: string;
  intro: string;
  footer: ReactNode;
  children: ReactNode;
}

/** Shared chrome for login, register and the post-registration state. */
export function AuthFormLayout({ kicker, title, intro, footer, children }: AuthFormLayoutProps) {
  return (
    <div className="form-inner">
      <div className="form-kicker">
        <span className="kicker-line" /> {kicker}
      </div>
      <h2>{title}</h2>
      <p className="form-intro">{intro}</p>
      {children}
      <div className="switch-auth">{footer}</div>
      <div className="secure-note">
        <span className="lock-icon">✓</span>
        <span>Your workspace, securely yours.</span>
      </div>
    </div>
  );
}
