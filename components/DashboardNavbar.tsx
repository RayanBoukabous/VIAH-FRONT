'use client';

import { useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageDropdown from './LanguageDropdown';
import { getMe, logout, type AuthUser } from '@/lib/api';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';

export default function DashboardNavbar() {
  const locale = useLocale();
  const router = useRouter();
  const [notifications] = useState(3);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleProfileClick = () => {
    router.push(`/${locale}/dashboard/profile`);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    try {
      await logout();
    } catch {
      /* still navigate away */
    }
    setUser(null);
    router.push(`/${locale}/login`);
    router.refresh();
  };

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
      : user?.username?.slice(0, 2).toUpperCase() ?? '—';

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 right-0 left-64 h-[72px] z-30 border-b border-slate-200 dark:border-cyan-500/10 bg-white/90 dark:bg-[#030B1A]/85 backdrop-blur-xl shadow-sm dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] dark:from-blue-500/[0.03] via-transparent to-cyan-500/[0.02] dark:to-cyan-500/[0.04] pointer-events-none" />
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4 relative">
        <div className="flex-1 max-w-xl min-w-0">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400 dark:text-cyan-500/50 group-focus-within:text-primary dark:group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={locale === 'en' ? 'Search lessons, topics…' : 'पाठ, विषय खोजें…'}
              className="block w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.04] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-blue-500/40 focus:border-primary/30 dark:focus:border-blue-400/30 focus:bg-white dark:focus:bg-white/[0.06] transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.03] py-1.5 px-2">
            <LanguageDropdown />
            <ThemeToggle />
          </div>

          <button
            type="button"
            className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-transparent hover:border-primary/15 dark:hover:border-cyan-500/20 transition-all"
            aria-label={locale === 'en' ? 'Notifications' : 'सूचनाएं'}
          >
            <NotificationsOutlined className="!w-5 !h-5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-[9px] font-bold flex items-center justify-center shadow ring-2 ring-white dark:ring-[#030B1A]">
                {notifications}
              </span>
            )}
          </button>

          <div className="sm:hidden flex items-center rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.03] py-1 px-1">
            <LanguageDropdown />
            <ThemeToggle />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-blue-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-md shadow-primary/20 ring-2 ring-primary/15 hover:ring-primary/30 hover:scale-[1.03] transition-all"
              aria-label={locale === 'en' ? 'Account menu' : 'खाता मेनू'}
            >
              {initials}
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0a1628]/95 backdrop-blur-xl py-2 z-50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-primary dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {locale === 'en' ? 'Profile' : 'प्रोफ़ाइल'}
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-white/[0.06]" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {locale === 'en' ? 'Logout' : 'लॉगआउट'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
