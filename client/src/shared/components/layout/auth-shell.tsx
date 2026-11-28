import type { ReactNode } from 'react';
import { Brand } from '@/shared/components/ui/brand';

/** Split-screen shell shared by login and register. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout">
      <aside className="story-panel">
        <Brand light />
        <div className="story-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> THE COMMERCE OPERATING SYSTEM
          </div>
          <h1>
            Good things
            <br />
            grow <em>together.</em>
          </h1>
          <p>One workspace for everything it takes to run a better business.</p>
          <div className="illustration" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="core">
              <div className="core-icon">
                <span>✓</span>
              </div>
              <div className="core-title">Your workspace</div>
              <div className="core-sub">All in one place</div>
            </div>
            <div className="float-card card-orders">
              <span className="float-icon mint">↗</span>
              <span>
                <b>Orders</b>
                <small>Moving smoothly</small>
              </span>
              <span className="float-dot" />
            </div>
            <div className="float-card card-inventory">
              <span className="float-icon peach">▦</span>
              <span>
                <b>Inventory</b>
                <small>In the right place</small>
              </span>
            </div>
            <div className="float-card card-people">
              <span className="float-icon lilac">♥</span>
              <span>
                <b>Your team</b>
                <small>Better together</small>
              </span>
            </div>
          </div>
        </div>
        <div className="story-footer">
          <span>BUILT FOR WHAT&apos;S NEXT</span>
          <span>© {new Date().getFullYear()} COMMERCEOS</span>
        </div>
      </aside>
      <section className="form-panel">
        <div className="mobile-brand">
          <Brand />
        </div>
        <div className="form-content">{children}</div>
        <div className="form-footer">
          <span>Made for the way you work.</span>
          <span>
            COMMERCEOS <span className="footer-dot">•</span> V1.0
          </span>
        </div>
      </section>
    </main>
  );
}
