'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';

/** One store per React tree instance; avoids leaking state across SSR requests. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
