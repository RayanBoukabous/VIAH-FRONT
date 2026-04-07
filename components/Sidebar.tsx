'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMe, type AuthUser } from '@/lib/api';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import BookmarkBorderOutlined from '@mui/icons-material/BookmarkBorderOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import ViewModuleOutlined from '@mui/icons-material/ViewModuleOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

export default function Sidebar() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
      : user?.username?.slice(0, 2).toUpperCase() ?? '—';

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username ?? '…';

  const menuItems = [
    { key: 'dashboard', href: '/dashboard', icon: <DashboardOutlined className="!w-5 !h-5" /> },
    { key: 'trimesters', href: '/dashboard/trimesters', icon: <CalendarMonthOutlined className="!w-5 !h-5" /> },
    { key: 'myTerms', href: '/dashboard/terms', icon: <BookmarkBorderOutlined className="!w-5 !h-5" /> },
    { key: 'courses', href: '/dashboard/courses', icon: <MenuBookOutlined className="!w-5 !h-5" /> },
    { key: 'modules', href: '/dashboard/modules', icon: <ViewModuleOutlined className="!w-5 !h-5" /> },
    { key: 'progress', href: '/dashboard/progress', icon: <BarChartOutlined className="!w-5 !h-5" /> },
    { key: 'settings', href: '/dashboard/settings', icon: <SettingsOutlined className="!w-5 !h-5" /> },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 z-40 flex flex-col border-r border-slate-200 dark:border-cyan-500/10 bg-white dark:bg-gradient-to-b dark:from-[#051a32] dark:via-[#041528] dark:to-[#020817] shadow-sm dark:shadow-[4px_0_40px_-8px_rgba(52,150,226,0.15)]">
      <div className="pointer-events-none absolute inset-0 dark:bg-[linear-gradient(180deg,rgba(52,150,226,0.04)_0%,transparent_40%,rgba(0,212,255,0.03)_100%)]" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 dark:via-cyan-400/20 to-transparent" />

      <div className="relative flex flex-col h-full">
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.06]">
          <Link href={`/${locale}/dashboard`} className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
              <Image
                src="/assets/logo/logo_viah.png"
                alt="VIAH"
                width={128}
                height={40}
                className="relative h-8 w-auto dark:brightness-110 dark:contrast-105"
                priority
              />
            </div>
          </Link>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/60 dark:text-cyan-400/70">
            {locale === 'hi' ? 'लर्निंग वर्कस्पेस' : 'Learning workspace'}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item, i) => {
            const base = `/${locale}${item.href}`;
            const isActive =
              item.href === '/dashboard'
                ? pathname === base || pathname === `${base}/`
                : pathname === base || pathname.startsWith(`${base}/`);
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <Link
                  href={`/${locale}${item.href}`}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'text-white dark:text-white shadow-[0_0_20px_-4px_rgba(52,150,226,0.4)] dark:shadow-[0_0_24px_-4px_rgba(52,150,226,0.5)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <>
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/80 dark:from-blue-600/35 via-primary/60 dark:via-blue-500/20 to-cyan-500/50 dark:to-cyan-500/15 border border-primary/30 dark:border-blue-400/25" />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-white/80 dark:bg-gradient-to-b dark:from-cyan-400 dark:to-primary" />
                    </>
                  )}
                  <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-cyan-300'}`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10 font-medium text-sm">{t(`sidebar.${item.key}`)}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary/20 ring-2 ring-primary/15 dark:ring-blue-400/20 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
              <p className="text-[11px] text-primary/70 dark:text-cyan-400/80 truncate">
                {locale === 'hi' ? 'छात्र' : 'Student'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
