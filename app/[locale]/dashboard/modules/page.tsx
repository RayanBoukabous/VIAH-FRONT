'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { ApiError, getMyModules, type UserModule } from '@/lib/api';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-slate-200/75 bg-white/82 shadow-[0_12px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-xl',
        'dark:border-white/[0.08] dark:bg-white/[0.045] dark:shadow-[0_18px_60px_-24px_rgba(0,0,0,0.55)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.26),transparent_45%,rgba(59,130,246,0.05))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%,rgba(6,182,212,0.08))]" />
      {children}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.04]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white tabular-nums">{value}</p>
    </div>
  );
}

function ModuleCardSkeleton() {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="module-shimmer h-48 bg-slate-100 dark:bg-white/[0.04]" />
      <div className="space-y-3 p-5">
        <div className="module-shimmer h-5 w-2/3 rounded-lg bg-slate-100 dark:bg-white/[0.05]" />
        <div className="module-shimmer h-4 w-full rounded bg-slate-100 dark:bg-white/[0.05]" />
        <div className="module-shimmer h-10 w-full rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
      </div>
    </GlassPanel>
  );
}

export default function ModulesPage() {
  const locale = useLocale();
  const [modules, setModules] = useState<UserModule[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyModules();
        if (!cancelled) {
          setModules(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setModules([]);
          setError(e instanceof ApiError ? 'api' : 'unknown');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalCourses = useMemo(
    () => (modules ?? []).reduce((acc, item) => acc + (item.courseCount ?? 0), 0),
    [modules]
  );

  const totalLessons = useMemo(
    () => (modules ?? []).reduce((acc, item) => acc + (item.lessonCount ?? 0), 0),
    [modules]
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B1220] dark:text-slate-100">
      <style>{`
        @keyframes moduleGridMove {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-8px,0); }
          100% { transform: translate3d(0,0,0); }
        }
        @keyframes moduleShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .module-shimmer {
          background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.52) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: moduleShimmer 1.6s linear infinite;
        }
        .dark .module-shimmer {
          background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(6,182,212,0.1),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(6,182,212,0.13),transparent_24%),linear-gradient(180deg,#0B1220_0%,#09101C_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.28] dark:opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            animation: 'moduleGridMove 16s ease-in-out infinite',
          }}
        />
      </div>

      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full px-3 pb-10 pt-[88px] sm:px-4 sm:pt-[92px] lg:ml-64 lg:w-auto lg:max-w-none lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-[1680px] space-y-6"
        >
          <motion.section variants={item}>
            <GlassPanel className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.1),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.1),transparent_24%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.2),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.14),transparent_28%)]" />
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-cyan-400/10 dark:bg-white/[0.04] dark:text-cyan-300/90">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    {locale === 'hi' ? 'मॉड्यूल लाइब्रेरी' : 'Module library'}
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white lg:text-5xl">
                    {locale === 'hi' ? 'मेरे मॉड्यूल' : 'My Modules'}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300/85 lg:text-base">
                    {locale === 'hi'
                      ? 'आपके लिए उपलब्ध सभी विषय, अध्याय और अध्ययन ट्रैक्स एक ही प्रीमियम दृश्य में।'
                      : 'All your available subjects, learning tracks, and next best modules in one premium experience.'}
                  </p>
                </div>

                <div className="grid min-w-[280px] grid-cols-2 gap-3 lg:grid-cols-3">
                  <StatPill label={locale === 'hi' ? 'मॉड्यूल' : 'Modules'} value={modules?.length ?? 0} />
                  <StatPill label={locale === 'hi' ? 'कोर्स' : 'Courses'} value={totalCourses} />
                  <StatPill label={locale === 'hi' ? 'लेसन' : 'Lessons'} value={totalLessons} />
                </div>
              </div>
            </GlassPanel>
          </motion.section>

          <motion.section variants={item}>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 h-1.5 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {locale === 'hi' ? 'उपलब्ध मॉड्यूल' : 'Available modules'}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {locale === 'hi'
                    ? 'छोटा zoom hover, clean border highlight, no blur distractions.'
                    : 'Clean hover interactions, subtle blue borders, and focused premium cards.'}
                </p>
              </div>
            </div>

            {error ? (
              <GlassPanel className="p-5">
                <p className="text-sm text-rose-600 dark:text-rose-300">
                  {locale === 'hi' ? 'मॉड्यूल लोड नहीं हो सके।' : 'Could not load your modules.'}
                </p>
              </GlassPanel>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {modules === null
                ? [0, 1, 2, 3].map((index) => <ModuleCardSkeleton key={index} />)
                : null}

              {modules !== null && modules.length === 0 && !error ? (
                <GlassPanel className="col-span-full p-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'अभी तक कोई मॉड्यूल नहीं है।' : 'No modules yet.'}
                  </p>
                </GlassPanel>
              ) : null}

              {modules?.map((module, index) => {
                const coverSrc = module.imageUrl ?? module.iconUrl;
                return (
                  <motion.div
                    key={module.id}
                    variants={item}
                    whileHover={{ y: -4, scale: 1.015 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.65 }}
                    className="h-full"
                  >
                    <GlassPanel className="group h-full overflow-hidden transition-colors duration-300 hover:border-blue-400/60 dark:hover:border-blue-400/40">
                      <div className="relative h-48 overflow-hidden">
                        {coverSrc ? (
                          <>
                            <Image
                              src={coverSrc}
                              alt={module.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 via-blue-500/10 to-cyan-500/20 dark:from-blue-500/35 dark:via-blue-500/10 dark:to-cyan-500/25">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09)_0%,transparent_40%,rgba(255,255,255,0.03)_100%)]" />
                            <div className="absolute right-5 top-4 h-20 w-20 rounded-full bg-blue-500/18" />
                            <div className="absolute left-5 bottom-5 h-16 w-16 rounded-full bg-cyan-400/12" />
                          </div>
                        )}

                        <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                          0{index + 1}
                        </div>

                        <div className="absolute bottom-5 left-5 right-5">
                          <h3 className="line-clamp-2 text-xl font-bold text-white">{module.name}</h3>
                        </div>
                      </div>

                      <div className="relative z-10 flex h-[calc(100%-12rem)] flex-col p-5">
                        <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {module.description?.trim()
                            ? module.description
                            : locale === 'hi'
                              ? 'आपकी वर्तमान पढ़ाई के लिए तैयार अगला स्मार्ट मॉड्यूल।'
                              : 'A smart next-step module curated for your current learning track.'}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/[0.05]">
                            {module.courseCount ?? 0} {locale === 'hi' ? 'कोर्स' : 'courses'}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/[0.05]">
                            {module.lessonCount ?? 0} {locale === 'hi' ? 'लेसन' : 'lessons'}
                          </span>
                        </div>

                        <Link
                          href={`/${locale}/dashboard/modules/${encodeURIComponent(module.id)}`}
                          className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:border-blue-400/40"
                        >
                          {locale === 'hi' ? 'मॉड्यूल खोलें' : 'Open module'}
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
