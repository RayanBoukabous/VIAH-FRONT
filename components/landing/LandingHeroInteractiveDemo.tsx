'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GlassPanel,
  LandingDashboardPreviewInner,
  LANDING_DASH_MOCK,
} from '@/components/landing/LandingDashboardPreview';

type PreviewRoute =
  | 'dashboard'
  | 'modules'
  | 'courses'
  | 'terms'
  | 'progress'
  | 'trimesters'
  | 'settings'
  | 'course-detail';

const MOCK_MODULES = [
  { id: '1', titleEn: 'STEM Foundations', titleHi: 'STEM आधार', terms: 3, cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80&auto=format&fit=crop' },
  { id: '2', titleEn: 'Language & Lit', titleHi: 'भाषा व साहित्य', terms: 4, cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80&auto=format&fit=crop' },
];

const MOCK_COURSES = [
  { id: 'c1', titleEn: 'Calculus I', titleHi: 'कैलकुलस I', module: 'STEM', progress: 24 },
  { id: 'c2', titleEn: 'Organic Chemistry', titleHi: 'ऑर्गेनिक केमिस्ट्री', module: 'STEM', progress: 0 },
  { id: 'c3', titleEn: 'World History', titleHi: 'विश्व इतिहास', module: 'Social', progress: 61 },
];

/** Only these sidebar entries navigate in the hero preview; others are visual only. */
const NAV_CLICKABLE: readonly PreviewRoute[] = ['dashboard', 'modules', 'courses'];

function isNavClickable(id: PreviewRoute): boolean {
  return (NAV_CLICKABLE as readonly string[]).includes(id);
}

function NavIcon({ name }: { name: string }) {
  const cls = 'h-4 w-4 shrink-0';
  switch (name) {
    case 'dashboard':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'modules':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      );
    case 'courses':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'terms':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      );
    case 'progress':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'trimesters':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return <span className={cls} />;
  }
}

function routeTitle(route: PreviewRoute, hi: boolean): string {
  const map: Record<PreviewRoute, [string, string]> = {
    dashboard: ['Dashboard', 'डैशबोर्ड'],
    modules: ['Modules', 'मॉड्यूल'],
    courses: ['Courses', 'पाठ्यक्रम'],
    terms: ['My terms', 'मेरे टर्म'],
    progress: ['Progress', 'प्रगति'],
    trimesters: ['Trimesters', 'ट्राइमेस्टर'],
    settings: ['Settings', 'सेटिंग्स'],
    'course-detail': ['Course', 'पाठ्यक्रम'],
  };
  const [en, h] = map[route];
  return hi ? h : en;
}

export default function LandingHeroInteractiveDemo() {
  const locale = useLocale();
  const hi = locale === 'hi';
  const [route, setRoute] = useState<PreviewRoute>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /** Stays true until sidebar exit animation finishes — keeps padding + overlay in sync (avoids layout jump). */
  const [sidebarReserveLayout, setSidebarReserveLayout] = useState(false);
  const sidebarOpenRef = useRef(sidebarOpen);
  sidebarOpenRef.current = sidebarOpen;

  useEffect(() => {
    if (sidebarOpen) setSidebarReserveLayout(true);
  }, [sidebarOpen]);

  const go = useCallback((r: PreviewRoute) => {
    if (!isNavClickable(r) && r !== 'course-detail') return;
    setRoute(r);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      if (next) setSidebarReserveLayout(true);
      return next;
    });
  }, []);

  const navGroups: { label: [string, string]; items: { id: PreviewRoute; icon: string; label: [string, string] }[] }[] = [
    {
      label: [hi ? 'अध्ययन' : 'Learning', hi ? 'अध्ययन' : 'Learning'],
      items: [
        { id: 'dashboard', icon: 'dashboard', label: ['Dashboard', 'डैशबोर्ड'] },
        { id: 'modules', icon: 'modules', label: ['Modules', 'मॉड्यूल'] },
        { id: 'courses', icon: 'courses', label: ['Courses', 'पाठ्यक्रम'] },
        { id: 'terms', icon: 'terms', label: ['My terms', 'मेरे टर्म'] },
      ],
    },
    {
      label: [hi ? 'जानकारी' : 'Insights', hi ? 'जानकारी' : 'Insights'],
      items: [
        { id: 'progress', icon: 'progress', label: ['Progress', 'प्रगति'] },
        { id: 'trimesters', icon: 'trimesters', label: ['Trimesters', 'ट्राइमेस्टर'] },
      ],
    },
    {
      label: [hi ? 'सिस्टम' : 'System', hi ? 'सिस्टम' : 'System'],
      items: [{ id: 'settings', icon: 'settings', label: ['Settings', 'सेटिंग्स'] }],
    },
  ];

  const showSidebar = sidebarOpen;
  const loginHref = `/${locale}/login`;
  const dashHref = `/${locale}/dashboard`;

  return (
    <div className="group relative mx-auto w-full max-w-[min(100%,620px)] sm:max-w-[min(100%,680px)] xl:max-w-full">
      <div className="pointer-events-none absolute -inset-2 rounded-[2.5rem] bg-gradient-to-br from-blue-500/25 via-cyan-400/15 to-violet-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-50/90 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] dark:border-white/[0.08] dark:bg-[#0c1220]/95 dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]">
        {/* Soft rounded ambient + edge fades (avoids “square” gradient cuts) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_120%_85%_at_50%_-10%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(ellipse_90%_70%_at_100%_80%,rgba(6,182,212,0.1),transparent_50%),radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(139,92,246,0.08),transparent_48%)] dark:bg-[radial-gradient(ellipse_120%_85%_at_50%_-10%,rgba(59,130,246,0.22),transparent_58%),radial-gradient(ellipse_90%_70%_at_100%_80%,rgba(6,182,212,0.14),transparent_52%),radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(139,92,246,0.12),transparent_50%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-3 top-14 bottom-0 rounded-[1.35rem] bg-gradient-to-b from-transparent via-transparent to-slate-100/90 dark:to-[#0a0f18]/85"
          aria-hidden
        />
        {/* Top chrome: burger + title */}
        <div className="relative z-20 flex items-center gap-2 border-b border-slate-200/70 bg-white/90 px-2 py-2 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.04] sm:px-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]"
            aria-expanded={showSidebar}
            aria-controls="hero-demo-sidebar"
            aria-label={hi ? 'साइडबार टॉगल' : 'Toggle sidebar'}
          >
            <span className="relative block h-3.5 w-4">
              <span className="absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current" />
              <span className="absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-current" />
              <span className="absolute left-0 top-3 h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {hi ? 'पूर्वावलोकन' : 'Preview'} · {LANDING_DASH_MOCK.fullName}
            </p>
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{routeTitle(route, hi)}</p>
          </div>
          <Link
            href={dashHref}
            className="hidden shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold text-blue-600 hover:underline dark:text-cyan-400 sm:inline"
          >
            {hi ? 'खोलें' : 'Open'}
          </Link>
        </div>

        <div className="relative z-10 flex min-h-[min(420px,min(62vh,720px))] flex-row sm:min-h-[min(480px,min(65vh,760px))]">
          {/* Sidebar — on small screens: overlay panel; sm+: in-flow */}
          <AnimatePresence
            initial={false}
            onExitComplete={() => {
              if (!sidebarOpenRef.current) setSidebarReserveLayout(false);
            }}
          >
            {showSidebar ? (
              <motion.aside
                key="hero-demo-sidebar"
                id="hero-demo-sidebar"
                initial={{ x: -12, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -12, opacity: 1 }}
                transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                className="absolute left-0 top-0 z-30 h-full w-44 shrink-0 overflow-hidden rounded-br-3xl border-slate-200/70 shadow-lg shadow-slate-900/10 dark:border-white/[0.06] dark:shadow-black/40 sm:relative sm:left-auto sm:top-auto sm:z-0 sm:h-auto sm:rounded-none sm:shadow-none sm:border-r"
              >
                <nav className="flex h-full max-h-[min(720px,min(65vh,800px))] w-44 flex-col gap-3 overflow-y-auto overscroll-contain rounded-br-3xl border-r border-slate-200/70 bg-slate-100/95 px-2 py-3 backdrop-blur-sm dark:border-white/[0.06] dark:bg-[#0a0f18]/95 sm:rounded-none">
                  {navGroups.map((g) => (
                    <div key={g.label[0]}>
                      <p className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {hi ? g.label[1] : g.label[0]}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {g.items.map((item) => {
                          const clickable = isNavClickable(item.id);
                          const active =
                            clickable &&
                            (route === item.id || (item.id === 'courses' && route === 'course-detail'));
                          const baseRow =
                            'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] font-medium transition-colors';
                          if (!clickable) {
                            return (
                              <div
                                key={item.id}
                                className={`${baseRow} cursor-not-allowed text-slate-400 opacity-55 dark:text-slate-500`}
                                aria-disabled="true"
                                title={
                                  hi
                                    ? 'इस पूर्वावलोकन में केवल डैशबोर्ड, मॉड्यूल और पाठ्यक्रम सक्रिय हैं'
                                    : 'Preview: only Dashboard, Modules & Courses are interactive'
                                }
                              >
                                <NavIcon name={item.icon} />
                                <span className="truncate">{hi ? item.label[1] : item.label[0]}</span>
                              </div>
                            );
                          }
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => go(item.id)}
                              className={`${baseRow} ${
                                active
                                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/15 text-indigo-800 dark:from-indigo-500/25 dark:to-cyan-500/10 dark:text-white'
                                  : 'text-slate-600 hover:bg-white/80 dark:text-slate-300 dark:hover:bg-white/[0.06]'
                              }`}
                            >
                              <NavIcon name={item.icon} />
                              <span className="truncate">{hi ? item.label[1] : item.label[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </motion.aside>
            ) : null}
          </AnimatePresence>

          {/* Dim main (mobile) while sidebar is open or exiting — same timing as sidebarReserveLayout */}
          {sidebarReserveLayout ? (
            <button
              type="button"
              aria-label={hi ? 'मेनू बंद करें' : 'Close menu'}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 left-44 z-20 bg-slate-950/30 backdrop-blur-[1px] sm:hidden"
            />
          ) : null}

          {/* Main preview pane — pad until sidebar exit ends (not only when showSidebar) */}
          <div
            className={`relative z-10 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden transition-[padding] duration-300 ease-out sm:z-10 ${
              sidebarReserveLayout ? 'max-sm:pl-44' : ''
            }`}
          >
            <GlassPanel className="relative min-h-full rounded-none border-0 bg-transparent p-3 shadow-none sm:p-4">
              {route === 'dashboard' ? (
                <div key="dash" className="relative h-full">
                  <LandingDashboardPreviewInner locale={locale} showFooterCta={false} />
                </div>
              ) : null}

              {route === 'modules' ? (
                  <div key="mod" className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {hi ? 'मॉड्यूल (डेमो)' : 'Modules (demo)'}
                    </p>
                    {MOCK_MODULES.map((m) => (
                      <div
                        key={m.id}
                        className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-2 dark:border-white/[0.08] dark:bg-white/[0.04]"
                      >
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                          <Image src={m.cover} alt="" fill sizes="96px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{hi ? m.titleHi : m.titleEn}</p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {m.terms} {hi ? 'टर्म' : m.terms === 1 ? 'term' : 'terms'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
              ) : null}

              {route === 'courses' ? (
                  <div key="crs" className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {hi ? 'पाठ्यक्रम (डेमो)' : 'Courses (demo)'}
                    </p>
                    {MOCK_COURSES.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.04]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{hi ? c.titleHi : c.titleEn}</p>
                          <p className="text-[10px] text-slate-500">{c.module}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => go('course-detail')}
                          className="shrink-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-md shadow-indigo-500/20"
                        >
                          {hi ? 'खोलें' : 'Open'}
                        </button>
                      </div>
                    ))}
                  </div>
              ) : null}

              {route === 'terms' ? (
                  <div key="trm" className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'टर्म' : 'Terms'}</p>
                    <ul className="list-inside list-disc space-y-1 text-[12px]">
                      <li>{hi ? 'टर्म 1 — पूर्ण' : 'Term 1 — complete'}</li>
                      <li>{hi ? 'टर्म 2 — चालू' : 'Term 2 — in progress'}</li>
                    </ul>
                  </div>
              ) : null}

              {route === 'progress' ? (
                  <div key="prg" className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'प्रगति' : 'Progress'}</p>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-white/[0.08]">
                      <div className="h-2 w-[41%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">41% {hi ? 'कुल' : 'overall'}</p>
                  </div>
              ) : null}

              {route === 'trimesters' ? (
                  <div key="tri" className="text-sm text-slate-600 dark:text-slate-300">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'कैलेंडर' : 'Calendar'}</p>
                    <p className="mt-2 text-[12px]">{hi ? 'ट्राइमेस्टर 2 शुरू होने वाला है।' : 'Trimester 2 starts soon.'}</p>
                  </div>
              ) : null}

              {route === 'settings' ? (
                  <div key="set" className="text-sm text-slate-600 dark:text-slate-300">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'प्रोफ़ाइल' : 'Profile'}</p>
                    <p className="mt-2 text-[12px]">{hi ? 'डेमो — सेटिंग्स यहाँ दिखती हैं।' : 'Demo — settings appear here.'}</p>
                  </div>
              ) : null}

              {route === 'course-detail' ? (
                  <div key="cd" className="space-y-4">
                    <button
                      type="button"
                      onClick={() => go('courses')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      {hi ? 'पाठ्यक्रम पर वापस' : 'Back to courses'}
                    </button>

                    <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 shadow-inner shadow-slate-900/5 dark:border-white/[0.08]">
                      <div className="relative h-28 overflow-hidden rounded-t-[1.25rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500">
                        <Image
                          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop"
                          alt=""
                          fill
                          sizes="400px"
                          className="object-cover opacity-40 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-violet-500/20" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">STEM</p>
                          <p className="text-lg font-black text-white drop-shadow-sm">
                            {hi ? MOCK_COURSES[0].titleHi : MOCK_COURSES[0].titleEn}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4 rounded-b-[1.25rem] bg-white/95 p-4 dark:bg-[#111827]/95">
                        <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                          {hi
                            ? 'इमर्सिव पूर्वावलोकन: लॉग इन करके पूरी सामग्री और PDF अनलॉक करें।'
                            : 'Immersive preview: sign in to unlock full content, PDFs, and your progress.'}
                        </p>
                        <Link
                          href={loginHref}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500"
                        >
                          {hi ? 'अभी शुरू करें' : 'Start now'}
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
              ) : null}
            </GlassPanel>

            <div className="relative z-10 border-t border-slate-200/60 bg-gradient-to-t from-white/95 to-white/70 px-3 py-2.5 backdrop-blur-md dark:border-white/[0.06] dark:from-[#0c1220]/95 dark:to-[#0c1220]/70">
              <Link
                href={dashHref}
                className="flex items-center justify-center gap-2 text-[11px] font-semibold text-blue-600 dark:text-cyan-400"
              >
                {hi ? 'वास्तविक डैशबोर्ड खोलें' : 'Open real dashboard'}
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
