import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAMES } from '@/config/app.config';

/** Server-side guard; middleware handles the cheap redirect earlier. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const hasSession = Boolean(
    cookieStore.get(COOKIE_NAMES.accessToken)?.value ||
      cookieStore.get(COOKIE_NAMES.refreshToken)?.value,
  );

  if (!hasSession) redirect('/login');

  return children;
}
