import type { Metadata } from 'next';
import { AuthShell } from '@/components/ui/auth-shell';
import { AuthForm } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Sign in | CommerceOS',
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="THE COMMERCE OPERATING SYSTEM"
      heading={
        <>
          Think fast,
          <br />
          Build faster
        </>
      }
      description="One workspace for everything it takes to run a better business."
      action={{ href: '/register', label: 'Create an account' }}
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
