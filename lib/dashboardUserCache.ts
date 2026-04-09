import type { AuthUser } from '@/lib/api';

const KEY = 'viah_dashboard_user_cache';

/** Short-lived client cache so the dashboard shell can render without waiting for /auth/me on every navigation. */
export function readCachedDashboardUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function writeCachedDashboardUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* quota / private mode */
  }
}

export function clearCachedDashboardUser(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
