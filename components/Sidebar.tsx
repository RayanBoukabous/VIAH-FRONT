'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardUser } from '@/components/DashboardUserContext';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import ViewModuleOutlined from '@mui/icons-material/ViewModuleOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { useDashboardSidebar } from '@/components/DashboardSidebarContext';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* ─────────────────────────────────────────────────────────── */
/* Menu config                                                  */
/* ─────────────────────────────────────────────────────────── */

const MENU_GROUPS = [
  {
    labelEn: 'Learning',
    labelHi: 'अध्ययन',
    items: [
      { key: 'dashboard', href: '/dashboard',         icon: DashboardOutlined },
      { key: 'modules',   href: '/dashboard/modules', icon: ViewModuleOutlined },
      { key: 'courses',   href: '/dashboard/courses', icon: MenuBookOutlined },
    ],
  },
  {
    labelEn: 'Insights',
    labelHi: 'जानकारी',
    items: [{ key: 'progress', href: '/dashboard/progress', icon: BarChartOutlined }],
  },
  {
    labelEn: 'System',
    labelHi: 'सिस्टम',
    items: [
      { key: 'settings', href: '/dashboard/settings', icon: SettingsOutlined },
    ],
  },
];

/* ─────────────────────────────────────────────────────────── */
/* Sidebar                                                      */
/* ─────────────────────────────────────────────────────────── */

export default function Sidebar() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const user = useDashboardUser();
  const { mobileOpen, closeMobile } = useDashboardSidebar();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
      : user?.username?.slice(0, 2).toUpperCase() ?? '—';

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username ?? '…';

  const role = user?.role ?? (locale === 'hi' ? 'छात्र' : 'Student');

  function isActive(href: string): boolean {
    const base = `/${locale}${href}`;
    if (href === '/dashboard') return pathname === base || pathname === `${base}/`;
    return pathname === base || pathname.startsWith(`${base}/`);
  }

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label={locale === 'hi' ? 'मेनू बंद करें' : 'Close menu'}
          className="fixed inset-0 z-[45] bg-slate-950/55 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      {/* ── Injected keyframes ── */}
      <style>{`
        @keyframes sidebar-bg-shift {
          0%   { background-position: 0% 0%; }
          50%  { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes sidebar-orb-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.18; }
          50%       { transform: translateY(-24px) scale(1.08); opacity: 0.28; }
        }
        @keyframes sidebar-orb2-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.12; }
          50%       { transform: translateY(20px) scale(0.95); opacity: 0.22; }
        }
        @keyframes logo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
          50%       { box-shadow: 0 0 28px 6px rgba(99,102,241,0.18); }
        }
        @keyframes active-shimmer {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.5; }
        }
        @keyframes sidebar-border-glow {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.7; }
        }
        @keyframes sidebar-active-glow {
          0%, 100% { filter: blur(18px); opacity: 0.35; }
          50% { filter: blur(24px); opacity: 0.65; }
        }
      `}</style>

      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-[min(18rem,calc(100vw-1rem))] overflow-hidden p-2.5 sm:p-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:z-40 lg:w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          background: 'var(--sidebar-bg, #ffffff)',
        }}
      >
        {/* ── Light mode bg ── */}
        <div className="absolute inset-0 bg-white dark:hidden" />

        {/* ── Dark mode animated bg ── */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: 'linear-gradient(145deg, #0d1117 0%, #0f172a 40%, #0c1321 70%, #090e1a 100%)',
          }}
        />

        {/* Dark mode: animated orbs */}
        <div
          className="absolute hidden dark:block pointer-events-none"
          style={{
            top: '-60px', left: '-40px', width: '280px', height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
            animation: 'sidebar-orb-float 7s ease-in-out infinite',
            filter: 'blur(32px)',
          }}
        />
        <div
          className="absolute hidden dark:block pointer-events-none"
          style={{
            bottom: '60px', right: '-60px', width: '220px', height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
            animation: 'sidebar-orb2-float 9s ease-in-out infinite',
            filter: 'blur(28px)',
          }}
        />

        {/* Light mode: soft gradient top */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:hidden pointer-events-none" />

        {/* Right border line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent dark:via-indigo-500/20 pointer-events-none" />

        {/* ── Content ── */}
        <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/88 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-white/[0.07] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] dark:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.72)]">
          <div
            className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-white/50 dark:border-white/[0.03]"
            style={{ animation: 'sidebar-border-glow 6s ease-in-out infinite' }}
          />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-24 bg-gradient-to-b from-blue-500/8 to-transparent dark:from-blue-500/12" />

          {/* ── Logo ── */}
          <div className="px-4 pt-5 pb-4">
            <Link href={`/${locale}/dashboard`} onClick={() => closeMobile()} className="group block">
              <div className="relative flex items-center justify-center">
                {/* Glow ring (dark mode) */}
                <div
                  className="absolute inset-0 hidden rounded-[24px] pointer-events-none dark:block"
                  style={{ animation: 'logo-pulse 4s ease-in-out infinite' }}
                />
                <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(238,242,255,0.92))] px-4 py-5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_34px_-22px_rgba(59,130,246,0.34)] dark:border-white/[0.06] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] dark:group-hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))]">
                  <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-blue-500/15 blur-2xl dark:bg-blue-500/22" />
                  <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-cyan-400/12 blur-2xl dark:bg-cyan-400/18" />
                  <div className="relative flex flex-col items-center">
                    <span className="mb-2 rounded-full border border-blue-200/80 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700 shadow-sm dark:border-cyan-400/10 dark:bg-white/[0.05] dark:text-cyan-300/85">
                      VIAH AI
                    </span>
                    <Image
                      src="/assets/logo/logo_viah.png"
                      alt="VIAH"
                      width={192}
                      height={64}
                      className="relative h-14 w-auto dark:brightness-110"
                      priority
                    />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-indigo-500/80 dark:text-indigo-400/60">
                {locale === 'hi' ? 'लर्निंग वर्कस्पेस' : 'Learning workspace'}
              </p>
            </Link>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-5">
            {MENU_GROUPS.map((group) => (
              <div key={group.labelEn}>
                {/* Group label */}
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.24em]
                  text-slate-400/70 dark:text-white/25">
                  {locale === 'hi' ? group.labelHi : group.labelEn}
                </p>

                {/* Items */}
                <div className="space-y-0.5">
                  {group.items.map((item, i) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                      >
                        <Link
                          href={`/${locale}${item.href}`}
                          onClick={() => closeMobile()}
                          className={`
                            relative group flex items-center gap-3 px-3.5 py-3
                            rounded-2xl text-sm font-medium transition-all duration-200 overflow-hidden
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40
                            ${active
                              ? 'text-white dark:text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }
                          `}
                        >
                          {/* Active background */}
                          <AnimatePresence>
                            {active && (
                              <>
                                <motion.span
                                  key="active-bg"
                                  layoutId="sidebar-active-pill"
                                  className="absolute inset-0 rounded-2xl"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                  style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 45%, #06b6d4 100%)',
                                    boxShadow: '0 14px 34px -14px rgba(59,130,246,0.72)',
                                  }}
                                />
                                <span
                                  className="absolute inset-x-5 top-1/2 h-10 -translate-y-1/2 rounded-full bg-cyan-300/35 dark:bg-cyan-400/20"
                                  style={{ animation: 'sidebar-active-glow 3s ease-in-out infinite' }}
                                />
                              </>
                            )}
                          </AnimatePresence>

                          {/* Hover background (inactive) */}
                          {!active && (
                            <span className="absolute inset-0 rounded-2xl bg-slate-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-white/[0.05]" />
                          )}

                          {/* Active shimmer overlay */}
                          {active && (
                            <span
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                                animation: 'active-shimmer 3s ease-in-out infinite',
                              }}
                            />
                          )}

                          {/* Active left accent bar */}
                          {active && (
                            <motion.span
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              className="absolute left-0 top-1/2 h-7 w-[4px] -translate-y-1/2 rounded-r-full bg-white/80"
                            />
                          )}

                          {/* Icon */}
                          <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200
                            ${active
                              ? 'border-white/15 bg-white/10 text-white'
                              : 'border-slate-200 bg-white/60 text-slate-400 group-hover:border-blue-100 group-hover:bg-white group-hover:text-indigo-500 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-500 dark:group-hover:border-white/[0.1] dark:group-hover:bg-white/[0.08] dark:group-hover:text-indigo-400'
                            }`}>
                            <Icon className="!w-[18px] !h-[18px]" />
                          </span>

                          {/* Label */}
                          <span className="relative z-10 truncate font-semibold">
                            {t(`sidebar.${item.key}`)}
                          </span>

                          {/* Active dot indicator */}
                          {active && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="relative z-10 ml-auto h-2 w-2 flex-shrink-0 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.75)]"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* ── User card ── */}
          <div className="border-t border-slate-100 px-3 pb-4 pt-3 dark:border-white/[0.06]">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-3.5
              bg-slate-50 hover:bg-slate-100
              dark:bg-white/[0.04] dark:hover:bg-white/[0.07]
              border border-slate-200 dark:border-white/[0.07]
              transition-all duration-200 cursor-default group shadow-sm dark:shadow-none">

              {/* Subtle gradient bg (dark) */}
              <div className="absolute inset-0 hidden dark:block pointer-events-none
                bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl
                  bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500
                  flex items-center justify-center text-white text-xs font-bold
                  shadow-md shadow-indigo-500/25 ring-2 ring-white dark:ring-indigo-500/20">
                  {initials}
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                  bg-emerald-500 border-2 border-white dark:border-[#0d1117]" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-indigo-500/80 dark:text-indigo-400/70 capitalize truncate">
                  {role}
                </p>
              </div>

              {/* Chevron */}
              <svg className="w-3.5 h-3.5 text-slate-400 dark:text-white/30 flex-shrink-0 relative z-10"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
