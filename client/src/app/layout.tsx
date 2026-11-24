import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'CommerceOS | Your commerce, in sync', description: 'Sign in to your CommerceOS workspace.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
