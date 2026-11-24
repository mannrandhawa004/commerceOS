import { AuthShell } from '../../modules/auth/components/auth-shell';
export default function AuthLayout({ children }: { children: React.ReactNode }) { return <AuthShell>{children}</AuthShell>; }
