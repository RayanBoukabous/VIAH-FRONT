'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { AuthUser } from '@/lib/api';

const DashboardUserContext = createContext<AuthUser | null>(null);

/** Single source of truth after DashboardAuthGuard has loaded /auth/me once. */
export function DashboardUserProvider({ user, children }: { user: AuthUser; children: ReactNode }) {
  return <DashboardUserContext.Provider value={user}>{children}</DashboardUserContext.Provider>;
}

export function useDashboardUser(): AuthUser | null {
  return useContext(DashboardUserContext);
}
