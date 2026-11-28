import type { Metadata } from 'next';
import { AuthShell } from '@/components/ui/auth-shell';
import { AuthForm } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Create an account | CommerceOS',
};

export default function RegisterPage() {
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
      description="Set up your workspace once, then run every part of the business from it."
      action={{ href: '/login', label: 'Sign in instead' }}
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
