'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/** Aligné sur les constantes mock de `app/[locale]/dashboard/page.tsx` */
export const LANDING_DASH_MOCK = {
  studyMinutes: 165,
  enrolledCourses: 10,
  completedLessons: 58,
  totalLessons: 142,
  progress: 41,
  streak: 7,
  weeklyGoal: 68,
  levelLabel: 'Grade 10',
  specialityLabel: 'Science',
  fullName: 'Alex Rivers',
  initials: 'AR',
};

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

export function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/80 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.22)] backdrop-blur-xl',
        'dark:border-white/[0.08] dark:bg-white/[0.045] dark:shadow-[0_18px_60px_-24px_rgba(0,0,0,0.55)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_130%_90%_at_50%_-15%,rgba(255,255,255,0.45),transparent_58%),radial-gradient(ellipse_100%_70%_at_100%_0%,rgba(59,130,246,0.06),transparent_52%)] dark:bg-[radial-gradient(ellipse_120%_85%_at_40%_-25%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(ellipse_90%_60%_at_90%_5%,rgba(6,182,212,0.1),transparent_50%)]" />
      {children}
    </div>
  );
}

function MiniProgressRing({ value, size = 88 }: { value: number; size?: number }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="landing-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-200/80 dark:text-white/[0.06]" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#landing-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-xl font-black text-transparent">{value}%</span>
      </div>
    </div>
  );
}

type Props = { locale: string };

type InnerProps = Props & {
  /** When false, footer CTA is omitted (e.g. hero shell adds its own link). */
  showFooterCta?: boolean;
};

/** Dashboard body only — use inside `GlassPanel` from the hero interactive shell. */
export function LandingDashboardPreviewInner({ locale, showFooterCta = true }: InnerProps) {
  const m = LANDING_DASH_MOCK;
  const hi = locale === 'hi';

  const stats = [
    {
      title: hi ? 'आज की पढ़ाई' : 'Study today',
      value: `${m.studyMinutes}`,
      unit: 'min',
      accent: 'from-blue-500 to-cyan-500',
    },
    {
      title: hi ? 'पाठ्यक्रम' : 'Courses',
      value: `${m.enrolledCourses}`,
      unit: '',
      accent: 'from-violet-500 to-blue-600',
    },
    {
      title: hi ? 'पाठ प्रगति' : 'Lessons',
      value: `${m.completedLessons}/${m.totalLessons}`,
      unit: '',
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      title: hi ? 'स्ट्रीक' : 'Streak',
      value: `${m.streak}`,
      unit: hi ? 'दिन' : 'd',
      accent: 'from-orange-500 to-rose-600',
    },
  ];

  return (
    <>
      {/* Soft rounded glows (blur) — avoids “square” gradient edges from hard radial stops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
        <div
          className="absolute -left-[22%] -top-[42%] h-[min(95%,320px)] w-[min(118%,400px)] rounded-[100%] bg-blue-500/[0.14] blur-[46px] dark:bg-blue-500/[0.22]"
          aria-hidden
        />
        <div
          className="absolute left-[28%] -top-[28%] h-[min(75%,260px)] w-[min(95%,340px)] rounded-[100%] bg-cyan-400/[0.09] blur-[40px] dark:bg-cyan-400/[0.16]"
          aria-hidden
        />
        <div
          className="absolute -right-[10%] top-[8%] h-[45%] w-[55%] rounded-[100%] bg-indigo-500/[0.06] blur-[36px] dark:bg-indigo-400/[0.1]"
          aria-hidden
        />
        {/* Feather edges into card — long fade, no hard box */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_115%_95%_at_50%_-5%,transparent_0%,transparent_48%,rgba(255,255,255,0.35)_100%)] dark:bg-[radial-gradient(ellipse_115%_95%_at_50%_-5%,transparent_40%,transparent_58%,rgba(15,23,42,0.45)_100%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700 dark:border-cyan-400/10 dark:bg-white/[0.04] dark:text-cyan-300/90">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          {hi ? 'लर्निंग कमांड सेंटर' : 'Learning command center'}
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-blue-500/30">
            {m.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{hi ? 'वापसी पर स्वागत है' : 'Welcome back'}</p>
            <p className="truncate bg-gradient-to-r from-slate-950 via-blue-600 to-cyan-500 bg-clip-text text-lg font-black tracking-tight text-transparent dark:from-white dark:via-blue-100 dark:to-cyan-300 sm:text-xl">
              {m.fullName}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              {hi
                ? 'आज का फोकस, प्रगति और अगले मॉड्यूल — वही डैशबोर्ड अनुभव।'
                : 'Same dashboard experience: momentum, progress, and your next modules.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 text-[10px] text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
            {hi ? 'स्ट्रीक' : 'Streak'}: <strong className="text-slate-900 dark:text-white">{m.streak}</strong>
          </span>
          <span className="rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 text-[10px] text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
            {hi ? 'स्तर' : 'Level'}: <strong className="text-slate-900 dark:text-white">{m.levelLabel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <GlassPanel className="p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {hi ? 'साप्ताहिक लक्ष्य' : 'Weekly goal'}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${m.weeklyGoal}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{m.weeklyGoal}%</p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {hi ? 'विशेषता' : 'Speciality'}
            </p>
            <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-950 dark:text-white">{m.specialityLabel}</p>
          </GlassPanel>
        </div>

        <div className="flex flex-col gap-3 rounded-[18px] border border-slate-200/60 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-white/[0.03] sm:flex-row sm:items-center">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {hi ? 'कुल प्रगति' : 'Overall progress'}
            </p>
            <MiniProgressRing value={m.progress} size={84} />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2">
            {stats.map((s) => (
              <div key={s.title} className="rounded-xl border border-slate-200/60 bg-white/80 p-2 dark:border-white/[0.06] dark:bg-white/[0.04]">
                <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.title}</p>
                <p className="mt-1 text-base font-black text-slate-950 dark:text-white">
                  {s.value}
                  {s.unit ? <span className="text-xs font-semibold opacity-80"> {s.unit}</span> : null}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {hi ? 'साप्ताहिक लर्निंग फ्लो' : 'Weekly learning flow'}
          </p>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="landing-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.92)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(v) => [`${v} min`, hi ? 'समय' : 'Time']}
                />
                <Area type="monotone" dataKey="min" stroke="#38BDF8" strokeWidth={2} fill="url(#landing-area)" animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {showFooterCta ? (
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center justify-center gap-2 border-t border-slate-200/60 pt-3 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <span>{hi ? 'पूरा डैशबोर्ड खोलें' : 'Open full dashboard'}</span>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        ) : null}
      </div>
    </>
  );
}

export default function LandingDashboardPreview({ locale }: Props) {
  return (
    <GlassPanel className="h-full p-4 sm:p-5">
      <LandingDashboardPreviewInner locale={locale} showFooterCta />
    </GlassPanel>
  );
}

export function LandingDashboardPreviewLink({ locale }: Props) {
  const href = `/${locale}/dashboard`;
  return (
    <Link
      href={href}
      className="group relative block max-w-[480px] outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 xl:max-w-none"
    >
      <span className="sr-only">{locale === 'hi' ? 'डैशबोर्ड खोलें' : 'Open dashboard preview'}</span>
      <div className="pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-violet-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative rounded-[28px] p-[1px] transition-transform duration-300 group-hover:scale-[1.01]">
        <LandingDashboardPreview locale={locale} />
      </div>
    </Link>
  );
}
