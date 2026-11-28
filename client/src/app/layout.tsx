import type { Metadata } from 'next';
import { AppProviders } from '@/shared/providers';
import './globals.css';
import '@/shared/styles/utilities.css';

export const metadata: Metadata = {
  title: 'CommerceOS | Your commerce, in sync',
  description: 'Sign in to your CommerceOS workspace.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
