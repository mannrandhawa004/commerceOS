import type { ReactNode } from 'react';

/** Standard form/page error alert. Renders nothing when empty. */
export function Alert({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <div className="form-error" role="alert">
      {children}
    </div>
  );
}
