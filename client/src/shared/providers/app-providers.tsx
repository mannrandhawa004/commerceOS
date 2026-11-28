'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from './store-provider';

/** Single mount point for all cross-cutting providers. */
export function AppProviders({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
