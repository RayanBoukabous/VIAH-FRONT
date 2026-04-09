'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getMe, type AuthUser } from '@/lib/api';
import { DashboardUserProvider } from '@/components/DashboardUserContext';
import { DashboardSidebarProvider } from '@/components/DashboardSidebarContext';
import {
  readCachedDashboardUser,
  writeCachedDashboardUser,
  clearCachedDashboardUser,
} from '@/lib/dashboardUserCache';

export default function DashboardAuthGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();
  /** sessionStorage lets the shell render immediately on repeat visits; /auth/me still refreshes in the effect. */
  const [user, setUser] = useState<AuthUser | null>(() => readCachedDashboardUser());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) {
          setUser(me);
          writeCachedDashboardUser(me);
        }
      } catch {
        clearCachedDashboardUser();
        if (!cancelled) {
          setUser(null);
          router.replace(`/${locale}/login`);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]); // router omitted on purpose — was retriggering /auth/me every navigation

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020817] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,150,226,0.12)_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3496E208_1px,transparent_1px),linear-gradient(to_bottom,#3496E208_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin" style={{ animationDuration: '0.9s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-md animate-pulse" />
          </div>
          <p className="text-sm font-medium tracking-wide text-blue-200/80">
            {locale === 'hi' ? 'आपका डैशबोर्ड तैयार हो रहा है…' : 'Preparing your workspace…'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardUserProvider user={user}>
      <DashboardSidebarProvider>{children}</DashboardSidebarProvider>
    </DashboardUserProvider>
  );
}
