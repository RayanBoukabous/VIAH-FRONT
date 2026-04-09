'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useDashboardUser } from '@/components/DashboardUserContext';
import { getMeDisplay, getMyModules, type UserModule } from '@/lib/api';

const activityData = [
  { day: 'Mon', min: 38 },
  { day: 'Tue', min: 52 },
  { day: 'Wed', min: 45 },
  { day: 'Thu', min: 61 },
  { day: 'Fri', min: 48 },
  { day: 'Sat', min: 72 },
  { day: 'Sun', min: 55 },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function AnimatedNumber({ value, suffix = '', duration = 900 }: { value: number; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplayValue(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/80 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.22)] backdrop-blur-xl',
        'dark:border-white/[0.08] dark:bg-white/[0.045] dark:shadow-[0_18px_60px_-24px_rgba(0,0,0,0.55)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32),transparent_45%,rgba(59,130,246,0.06))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%,rgba(6,182,212,0.08))]" />
      {children}
    </div>
  );
}

function ParallaxCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const rotateY = ((x / bounds.width) - 0.5) * 10;
        const rotateX = (0.5 - (y / bounds.height)) * 8;
        setRotate({ x: rotateX, y: rotateY });
      }}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y, y: -2 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.6 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProgressRing({ value, size = 168, stroke = 12 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative mx-auto shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="dashboard-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200/80 dark:text-white/[0.06]"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#dashboard-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-4xl font-black text-transparent">
          {value}%
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
          mastery
        </span>
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 h-1.5 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  accent,
}: {
  icon: ReactNode;
  title: string;
  value: ReactNode;
  subtitle: string;
  accent: string;
}) {
  return (
    <ParallaxCard className="h-full">
      <GlassPanel className="h-full p-5">
        <div className="relative z-10 flex h-full flex-col">
          <div className={cn('mb-4 inline-flex w-fit rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg', accent)}>
            {icon}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{title}</p>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </GlassPanel>
    </ParallaxCard>
  );
}

function ModuleCardSkeleton() {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="dashboard-shimmer h-44 bg-slate-100/70 dark:bg-white/[0.04]" />
      <div className="space-y-3 p-5">
        <div className="dashboard-shimmer h-5 w-2/3 rounded-lg bg-slate-100 dark:bg-white/[0.05]" />
        <div className="dashboard-shimmer h-4 w-full rounded bg-slate-100 dark:bg-white/[0.05]" />
        <div className="dashboard-shimmer h-10 w-full rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
      </div>
    </GlassPanel>
  );
}

export default function DashboardPage() {
  const locale = useLocale();
  const user = useDashboardUser();
  const [myModules, setMyModules] = useState<UserModule[] | null>(null);
  const [modulesLoadError, setModulesLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getMyModules();
        if (!cancelled) {
          setMyModules(list);
          setModulesLoadError(false);
        }
      } catch {
        if (!cancelled) {
          setMyModules([]);
          setModulesLoadError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = useMemo(() => (user ? getMeDisplay(user) : null), [user]);

  const lastLoginLabel = useMemo(() => {
    if (!display?.lastLogin) return null;
    try {
      const d = new Date(display.lastLogin);
      if (Number.isNaN(d.getTime())) return null;
      return new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return null;
    }
  }, [display?.lastLogin, locale]);

  const studyMinutes = 165;
  const enrolledCourses = 10;
  const completedLessons = 58;
  const totalLessons = 142;
  const progress = 41;
  const streak = 7;
  const weeklyGoal = 68;

  const stats = [
    {
      title: locale === 'hi' ? 'आज की पढ़ाई' : 'Study today',
      value: <><AnimatedNumber value={studyMinutes} /> <span className="text-lg font-semibold">min</span></>,
      subtitle: locale === 'hi' ? 'फोकस मोड में मजबूत शुरुआत' : 'A focused start to your day',
      accent: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: locale === 'hi' ? 'पाठ्यक्रम' : 'Courses',
      value: <AnimatedNumber value={enrolledCourses} />,
      subtitle: locale === 'hi' ? 'सक्रिय कोर्स अभी चल रहे हैं' : 'Active learning tracks in progress',
      accent: 'from-violet-500 to-blue-600',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: locale === 'hi' ? 'पाठ प्रगति' : 'Lessons progress',
      value: (
        <>
          <AnimatedNumber value={completedLessons} />/{totalLessons}
        </>
      ),
      subtitle: locale === 'hi' ? 'हर दिन आपकी प्रगति साफ दिखती है' : 'Your completion momentum is improving',
      accent: 'from-emerald-500 to-teal-600',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: locale === 'hi' ? 'स्ट्रीक' : 'Streak',
      value: (
        <>
          <AnimatedNumber value={streak} /> <span className="text-lg font-semibold">{locale === 'hi' ? 'दिन' : 'days'}</span>
        </>
      ),
      subtitle: locale === 'hi' ? 'लगातार सीखना जारी रखें' : 'Consistency is becoming your edge',
      accent: 'from-orange-500 to-rose-600',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B1220] dark:text-slate-100">
      <style>{`
        @keyframes dashboardGridMove {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-10px,0); }
          100% { transform: translate3d(0,0,0); }
        }
        @keyframes dashboardGlow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes dashboardShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .dashboard-shimmer {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0) 100%
          );
          background-size: 200% 100%;
          animation: dashboardShimmer 1.6s linear infinite;
        }
        .dark .dashboard-shimmer {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.08) 50%,
            rgba(255,255,255,0) 100%
          );
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.16),transparent_24%),linear-gradient(180deg,#0B1220_0%,#09101C_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            animation: 'dashboardGridMove 16s ease-in-out infinite',
          }}
        />
        <div className="absolute left-[16%] top-[-5rem] h-80 w-80 rounded-full bg-blue-500/10 blur-[110px] dark:bg-blue-500/18" style={{ animation: 'dashboardGlow 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[8%] right-[10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px] dark:bg-cyan-500/16" style={{ animation: 'dashboardGlow 10s ease-in-out infinite' }} />
      </div>

      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full px-3 pb-10 pt-[88px] sm:px-4 sm:pt-[92px] lg:ml-64 lg:w-auto lg:max-w-none lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto w-full max-w-[1680px] space-y-6">
          <motion.section variants={item} className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.85fr]">
            <GlassPanel className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.18),transparent_28%)]" />
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-cyan-400/10 dark:bg-white/[0.04] dark:text-cyan-300/90">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    {locale === 'hi' ? 'लर्निंग कमांड सेंटर' : 'Learning command center'}
                  </div>

                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 210 }}
                      className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-xl font-black text-white shadow-[0_16px_40px_-18px_rgba(59,130,246,0.65)] ring-1 ring-blue-400/30 sm:flex"
                    >
                      {display?.initials ?? '…'}
                    </motion.div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {locale === 'hi' ? 'वापसी पर स्वागत है' : 'Welcome back'}
                      </p>
                      <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white lg:text-5xl">
                        {display ? (
                          <span className="bg-gradient-to-r from-slate-950 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-cyan-300">
                            {display.fullName}
                          </span>
                        ) : (
                          <span className="dashboard-shimmer inline-block h-11 w-72 rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
                        )}
                      </h1>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300/85 lg:text-base">
                        {locale === 'hi'
                          ? 'आज के फोकस, आपकी प्रगति और अगले सबसे महत्वपूर्ण मॉड्यूल सब एक ही जगह पर।'
                          : 'Everything you need today: momentum, progress, and the next best modules to keep your learning streak alive.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {lastLoginLabel ? (
                      <div className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
                        {locale === 'hi' ? 'अंतिम लॉगिन' : 'Last login'}: <span className="font-semibold text-slate-900 dark:text-white">{lastLoginLabel}</span>
                      </div>
                    ) : null}
                    <div className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
                      {locale === 'hi' ? 'स्ट्रीक' : 'Streak'}: <span className="font-semibold text-slate-900 dark:text-white">{streak} {locale === 'hi' ? 'दिन' : 'days'}</span>
                    </div>
                    <div className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
                      {locale === 'hi' ? 'स्तर' : 'Level'}: <span className="font-semibold text-slate-900 dark:text-white">{display?.levelLabel ?? '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid min-w-[280px] grid-cols-2 gap-3">
                  <GlassPanel className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {locale === 'hi' ? 'साप्ताहिक लक्ष्य' : 'Weekly goal'}
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${weeklyGoal}%` }}
                        transition={{ duration: 1.15, ease: 'easeOut', delay: 0.25 }}
                      />
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{weeklyGoal}%</p>
                  </GlassPanel>
                  <GlassPanel className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {locale === 'hi' ? 'विशेषता' : 'Speciality'}
                    </p>
                    <p className="mt-3 line-clamp-2 text-base font-bold text-slate-950 dark:text-white">
                      {display?.specialityLabel ?? '—'}
                    </p>
                  </GlassPanel>
                </div>
              </div>
            </GlassPanel>

            <ParallaxCard className="h-full">
              <GlassPanel className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.08),transparent_36%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.18),transparent_40%)]" />
                <div className="relative z-10 flex w-full flex-col items-center text-center">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'कुल प्रगति' : 'Overall progress'}
                  </p>
                  <ProgressRing value={progress} />
                  <p className="mt-5 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'आप शानदार रफ्तार से सीख रहे हैं।' : 'You are learning at a strong, steady pace.'}
                  </p>
                </div>
              </GlassPanel>
            </ParallaxCard>
          </motion.section>

          <motion.section variants={item}>
            <SectionHeading
              title={locale === 'hi' ? 'आज की झलक' : 'Today at a glance'}
              subtitle={locale === 'hi' ? 'आपके प्रदर्शन और ध्यान का तेज सारांश' : 'A fast premium snapshot of momentum and focus'}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </motion.section>

          <motion.section variants={item} className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <GlassPanel className="p-6">
              <SectionHeading
                title={locale === 'hi' ? 'साप्ताहिक लर्निंग फ्लो' : 'Weekly learning flow'}
                subtitle={locale === 'hi' ? 'मिनटों के हिसाब से आपकी पढ़ाई' : 'Minutes spent across the week'}
                action={
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    +12% {locale === 'hi' ? 'पिछले सप्ताह से' : 'vs last week'}
                  </div>
                }
              />
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashboard-area-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ stroke: 'rgba(59,130,246,0.18)', strokeWidth: 1 }}
                      contentStyle={{
                        background: 'rgba(15,23,42,0.92)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        boxShadow: '0 18px 50px -22px rgba(0,0,0,0.65)',
                        color: '#fff',
                        backdropFilter: 'blur(12px)',
                      }}
                      labelStyle={{ color: '#cbd5e1' }}
                      formatter={(value) => [`${value ?? ''} min`, locale === 'hi' ? 'समय' : 'Time']}
                    />
                    <Area
                      type="monotone"
                      dataKey="min"
                      stroke="#38BDF8"
                      strokeWidth={3}
                      fill="url(#dashboard-area-fill)"
                      animationDuration={1350}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <div className="grid gap-6">
              <GlassPanel className="p-6">
                <SectionHeading
                  title={locale === 'hi' ? 'AI ट्यूटर' : 'AI Tutor'}
                  subtitle={locale === 'hi' ? 'तेज सहायता, चरण-दर-चरण जवाब' : 'Fast answers and guided explanations'}
                />
                <div className="relative overflow-hidden rounded-[22px] border border-blue-200/70 bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px] dark:border-white/[0.08]">
                  <div className="rounded-[21px] bg-white/90 p-5 dark:bg-[#0E1827]">
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3 text-white shadow-lg shadow-blue-500/20">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      {locale === 'hi' ? 'किसी भी विषय पर तुरंत मदद' : 'Get instant help on any topic'}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {locale === 'hi'
                        ? 'जटिल अध्याय, कठिन प्रश्न और तेज रिविजन, सब एक स्मार्ट जगह में।'
                        : 'Break down difficult chapters, solve tricky questions, and revise faster with contextual AI support.'}
                    </p>
                    <Link
                      href={`http://13.38.113.47/amb/login`}
                      
                      target="_blank"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30"
                    >
                      {locale === 'hi' ? 'AI के साथ शुरू करें' : 'Start with AI'}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <SectionHeading
                  title={locale === 'hi' ? 'स्मार्ट फोकस' : 'Smart focus'}
                  subtitle={locale === 'hi' ? 'आज क्या सबसे महत्वपूर्ण है' : 'What deserves your attention today'}
                />
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/[0.06] dark:bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {locale === 'hi' ? 'फोकस एरिया' : 'Focus area'}
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                      {display?.specialityLabel !== '—' ? display?.specialityLabel : locale === 'hi' ? 'मुख्य विषय' : 'Core subject'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/[0.06] dark:bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {locale === 'hi' ? 'सुझाव' : 'Suggestion'}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {locale === 'hi'
                        ? 'आज एक मॉड्यूल पूरा करें और फिर AI ट्यूटर से 10 मिनट रिविजन करें।'
                        : 'Finish one module today, then spend 10 minutes revising with the AI tutor to lock retention.'}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </motion.section>

          <motion.section variants={item}>
            <SectionHeading
              title={locale === 'hi' ? 'मेरे मॉड्यूल' : 'My modules'}
              subtitle={locale === 'hi' ? 'कंटिन्यू करें या नया मॉड्यूल एक्सप्लोर करें' : 'Continue where you left off or explore the next best module'}
              action={
                <Link
                  href={`/${locale}/dashboard/modules`}
                  className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-cyan-300"
                >
                  {locale === 'hi' ? 'सभी देखें' : 'View all'}
                </Link>
              }
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {modulesLoadError ? (
                <GlassPanel className="col-span-full p-5">
                  <p className="text-sm text-rose-600 dark:text-rose-300">
                    {locale === 'hi' ? 'मॉड्यूल लोड नहीं हो सके।' : 'Could not load your modules.'}
                  </p>
                </GlassPanel>
              ) : null}

              {myModules === null && !modulesLoadError
                ? [0, 1, 2].map((index) => <ModuleCardSkeleton key={index} />)
                : null}

              {myModules !== null && myModules.length === 0 && !modulesLoadError ? (
                <GlassPanel className="col-span-full p-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'अभी तक कोई मॉड्यूल नहीं है।' : 'No modules yet.'}
                  </p>
                </GlassPanel>
              ) : null}

              {myModules?.slice(0, 6).map((module, index) => {
                const coverSrc = module.imageUrl ?? module.iconUrl;
                return (
                  <ParallaxCard key={module.id} className="h-full">
                    <GlassPanel className="group h-full overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {coverSrc ? (
                          <>
                            <Image
                              src={coverSrc}
                              alt={module.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 via-blue-500/10 to-cyan-500/20 dark:from-blue-500/35 dark:via-blue-500/10 dark:to-cyan-500/25">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09)_0%,transparent_40%,rgba(255,255,255,0.03)_100%)]" />
                            <div className="absolute right-5 top-4 h-20 w-20 rounded-full bg-blue-500/20 blur-2xl" />
                            <div className="absolute left-5 bottom-5 h-16 w-16 rounded-full bg-cyan-400/15 blur-2xl" />
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
                            : display && display.specialityLabel !== '—'
                              ? display.specialityLabel
                              : locale === 'hi'
                                ? 'अगला सर्वश्रेष्ठ लर्निंग ट्रैक आपके लिए तैयार है।'
                                : 'Your next best learning track is ready to continue.'}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          {typeof module.courseCount === 'number' ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/[0.05]">
                              {module.courseCount} {locale === 'hi' ? 'कोर्स' : 'courses'}
                            </span>
                          ) : null}
                          {typeof module.lessonCount === 'number' ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/[0.05]">
                              {module.lessonCount} {locale === 'hi' ? 'लेसन' : 'lessons'}
                            </span>
                          ) : null}
                        </div>

                        <Link
                          href={`/${locale}/dashboard/modules/${encodeURIComponent(module.id)}`}
                          className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30"
                        >
                          {locale === 'hi' ? 'मॉड्यूल खोलें' : 'Open module'}
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </GlassPanel>
                  </ParallaxCard>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
