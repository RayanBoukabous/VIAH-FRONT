'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getMe, getMeDisplay, type AuthUser } from '@/lib/api';

const activityData = [
  { day: 'Mon', min: 38 },
  { day: 'Tue', min: 52 },
  { day: 'Wed', min: 45 },
  { day: 'Thu', min: 61 },
  { day: 'Fri', min: 48 },
  { day: 'Sat', min: 72 },
  { day: 'Sun', min: 55 },
];

function ProgressRing({ value, size = 160, stroke = 10 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3496E2" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-200 dark:text-white/[0.06]" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-transparent tabular-nums">
          {value}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">goal</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const locale = useLocale();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) {
          setUser(me);
          setLoadError(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setLoadError(true);
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

  const studyTimeToday = '2h 45min';
  const enrolledCourses = 10;
  const completedLessons = 58;
  const totalLessons = 142;
  const progress = 41;

  const stats = [
    {
      titleEn: 'Study today',
      titleHi: 'आज की पढ़ाई',
      value: studyTimeToday,
      sub: locale === 'hi' ? 'साप्ताहिक लक्ष्य के पास' : 'Near weekly goal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'from-primary to-cyan-500',
      glow: 'hover:shadow-primary/15',
    },
    {
      titleEn: 'Courses',
      titleHi: 'पाठ्यक्रम',
      value: String(enrolledCourses),
      sub: locale === 'hi' ? 'नामांकित' : 'enrolled',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      accent: 'from-violet-500 to-purple-600',
      glow: 'hover:shadow-violet-500/15',
    },
    {
      titleEn: 'Lessons',
      titleHi: 'पाठ',
      value: `${completedLessons}/${totalLessons}`,
      sub: locale === 'hi' ? 'पूर्ण' : 'completed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'from-emerald-500 to-teal-600',
      glow: 'hover:shadow-emerald-500/15',
    },
    {
      titleEn: 'Streak',
      titleHi: 'स्ट्रीक',
      value: '7',
      sub: locale === 'hi' ? 'दिन लगातार' : 'days in a row',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      accent: 'from-orange-500 to-rose-600',
      glow: 'hover:shadow-orange-500/15',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#030B1A] text-slate-900 dark:text-slate-100">
      <div className="fixed inset-0 pointer-events-none dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(52,150,226,0.1),transparent_50%)]" />

      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-[88px] pb-10 px-4 lg:px-8 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-[1600px] mx-auto space-y-6"
        >
          {loadError && (
            <motion.div
              variants={item}
              className="rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-200"
            >
              {locale === 'hi'
                ? 'प्रोफ़ाइल लोड नहीं हो सकी।'
                : 'Could not load your profile from the API.'}
            </motion.div>
          )}

          {/* Hero row */}
          <motion.div variants={item} className="flex flex-col xl:flex-row gap-6 xl:items-stretch">
            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-gradient-to-br dark:from-white/[0.06] dark:to-white/[0.02] p-6 lg:p-8 shadow-sm dark:shadow-none overflow-hidden relative group">
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/5 dark:bg-blue-500/20 blur-3xl group-hover:bg-primary/10 dark:group-hover:bg-blue-500/25 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 dark:via-cyan-500/40 to-transparent" />
              <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-primary/25 ring-2 ring-primary/15 shrink-0"
                >
                  {display?.initials ?? '…'}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 dark:text-cyan-400/80 mb-2">
                    {locale === 'hi' ? 'वापसी पर स्वागत है' : 'Welcome back'}
                  </p>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {display ? (
                      <>
                        <span className="bg-gradient-to-r from-slate-900 via-primary-dark to-primary dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text text-transparent">
                          {display.fullName}
                        </span>
                        <span className="text-primary dark:text-cyan-400/90">!</span>
                      </>
                    ) : (
                      <span className="inline-block h-9 w-56 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
                    )}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base max-w-xl">
                    {locale === 'hi'
                      ? 'आज के लिए आपका सीखने का सारांश — AI आपके साथ है।'
                      : 'Your learning snapshot for today — powered by AI.'}
                  </p>
                  {(display?.provider || lastLoginLabel) && (
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                      {display?.provider && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-300">
                          {locale === 'hi' ? 'साइन-इन: ' : 'Sign-in: '}
                          <span className="text-slate-900 dark:text-slate-300">{display.provider}</span>
                        </span>
                      )}
                      {lastLoginLabel && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-300">
                          {locale === 'hi' ? 'अंतिम लॉगिन: ' : 'Last login: '}
                          <span className="text-slate-900 dark:text-slate-300">{lastLoginLabel}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="xl:w-[300px] shrink-0 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0a1628]/80 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/3 dark:from-blue-500/5 to-transparent pointer-events-none" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 relative z-10">
                {locale === 'hi' ? 'कुल प्रगति' : 'Overall progress'}
              </p>
              <ProgressRing value={progress} />
              <p className="text-xs text-slate-500 mt-4 text-center relative z-10">
                {locale === 'hi'
                  ? 'पाठों के आधार पर — जारी रखें!'
                  : 'Based on lessons — keep going!'}
              </p>
            </div>
          </motion.div>

          {/* AI quick card */}
          <motion.div
            variants={item}
            className="rounded-2xl border border-primary/15 dark:border-cyan-500/20 bg-gradient-to-r from-blue-50 dark:from-blue-950/40 via-white dark:via-[#0a1628] to-cyan-50 dark:to-cyan-950/30 p-6 flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden shadow-sm dark:shadow-none"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {locale === 'hi' ? 'AI ट्यूटर से पूछें' : 'Ask your AI tutor'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {locale === 'hi'
                  ? 'किसी भी विषय में तुरंत स्पष्टीकरण, चरण-दर-चरण समाधान।'
                  : 'Instant explanations and step-by-step help on any topic.'}
              </p>
            </div>
            <Link
              href={`/${locale}/dashboard/courses`}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-cyan-500 hover:from-blue-400 hover:to-cyan-400 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
            >
              {locale === 'hi' ? 'शुरू करें' : 'Start'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none hover:border-primary/20 dark:hover:border-blue-400/20 transition-all duration-300 ${stat.glow} hover:shadow-xl`}
              >
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.accent} text-white shadow-md mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  {locale === 'hi' ? stat.titleHi : stat.titleEn}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Profile chips + chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div variants={item} className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {locale === 'hi' ? 'स्तर' : 'Level'}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{display?.levelLabel ?? '—'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {locale === 'hi' ? 'विशेषता' : 'Speciality'}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{display?.specialityLabel ?? '—'}</p>
              </div>
              <div className="rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-gradient-to-br dark:from-violet-950/40 dark:to-[#0a1628] p-5 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-violet-700 dark:text-violet-200">
                    {locale === 'hi' ? 'इस सप्ताह का लक्ष्य' : 'This week goal'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-violet-200 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">68% — {locale === 'hi' ? 'बढ़िया प्रगति!' : 'Great pace!'}</p>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0a1628]/80 p-6 shadow-sm dark:shadow-none min-h-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {locale === 'hi' ? 'साप्ताहिक लर्निंग' : 'Weekly learning'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {locale === 'hi' ? 'मिनटों में (नमूना डेटा)' : 'Minutes (sample data)'}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  +12% {locale === 'hi' ? 'वि.' : 'vs last wk'}
                </span>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3496E2" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#3496E2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--tooltip-bg, #ffffff)',
                        border: '1px solid rgba(52,150,226,0.2)',
                        borderRadius: '12px',
                        color: '#1e293b',
                      }}
                      formatter={(v) => [`${v ?? ''} min`, locale === 'hi' ? 'समय' : 'Time']}
                    />
                    <Area
                      type="monotone"
                      dataKey="min"
                      stroke="#3496E2"
                      strokeWidth={2}
                      fill="url(#fillArea)"
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Modules */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {locale === 'hi' ? 'मेरे मॉड्यूल' : 'My modules'}
              </h2>
              <Link
                href={`/${locale}/dashboard/modules`}
                className="text-sm font-semibold text-primary dark:text-cyan-400 hover:text-primary-dark dark:hover:text-cyan-300 transition-colors"
              >
                {locale === 'hi' ? 'सभी देखें →' : 'View all →'}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[{ id: 1, title: 'Mathematics', slug: 'mathematics' }].map((module, mi) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + mi * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-transparent shadow-sm dark:shadow-none"
                >
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/10 via-blue-50 to-cyan-50 dark:from-blue-600/30 dark:via-blue-500/10 dark:to-cyan-600/20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,150,226,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,150,226,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-primary/10 dark:bg-cyan-400/20 blur-2xl group-hover:bg-primary/15 dark:group-hover:bg-cyan-400/30 transition-all" />
                    <div className="relative h-full flex items-center justify-center">
                      <div className="w-18 h-18 rounded-2xl bg-white/80 dark:bg-white/[0.08] border border-primary/15 dark:border-white/10 flex items-center justify-center backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-500 p-4">
                        <svg className="w-10 h-10 text-primary dark:text-cyan-300" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 20h32M20 20v28M44 20v28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-cyan-200 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-5 line-clamp-2">
                      {display && display.specialityLabel !== '—'
                        ? display.specialityLabel
                        : locale === 'hi'
                          ? 'बीजगणित, ज्यामिति और कलन'
                          : 'Algebra, geometry & calculus'}
                    </p>
                    <Link
                      href={`/${locale}/dashboard/modules/${module.slug}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-primary/15 transition-all"
                    >
                      {locale === 'hi' ? 'मॉड्यूल खोलें' : 'Open module'}
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
