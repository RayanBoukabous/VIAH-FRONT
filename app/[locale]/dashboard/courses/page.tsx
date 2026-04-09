'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getAllMyCourses, type UserCourse } from '@/lib/api';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
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

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          'course-filter-select w-full cursor-pointer appearance-none rounded-xl border-2 py-3 pl-4 pr-12 text-sm font-semibold outline-none transition-all duration-200',
          'bg-gradient-to-br from-white via-slate-50 to-blue-50/50 text-slate-900',
          'border-slate-400/80 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.5),inset_0_1px_0_rgba(255,255,255,0.9)]',
          'hover:border-blue-500 hover:shadow-[0_10px_36px_-16px_rgba(59,130,246,0.55)]',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40',
          'scheme-light dark:scheme-dark',
          'dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-cyan-50',
          'dark:border-cyan-400/50 dark:shadow-[0_4px_28px_-10px_rgba(34,211,238,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]',
          'dark:hover:border-cyan-300 dark:hover:shadow-[0_12px_40px_-14px_rgba(34,211,238,0.4)]',
          'dark:focus:border-cyan-400 dark:focus:ring-cyan-400/35'
        )}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/25 transition-transform duration-200 group-hover:scale-105 group-focus-within:scale-105 dark:from-cyan-500 dark:via-blue-600 dark:to-indigo-700 dark:shadow-cyan-500/25 dark:ring-cyan-400/20"
        aria-hidden
      >
        <svg className="h-4 w-4 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}

function ParallaxCard({ children, className }: { children: ReactNode; className?: string }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const rotateY = (x / bounds.width - 0.5) * 10;
        const rotateX = (0.5 - y / bounds.height) * 8;
        setRotate({ x: rotateX, y: rotateY });
      }}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y, y: -2 }}
      whileHover={{ y: -8, scale: 1.012 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.6 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 h-1.5 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
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
  return <span className="tabular-nums">{displayValue}</span>;
}

function courseProgress(c: UserCourse): number {
  const p = c.progress;
  if (typeof p !== 'number' || Number.isNaN(p)) return 0;
  return Math.min(100, Math.max(0, Math.round(p)));
}

function courseStatus(c: UserCourse): 'completed' | 'in_progress' | 'not_started' {
  const p = courseProgress(c);
  if (p >= 100) return 'completed';
  if (p > 0) return 'in_progress';
  return 'not_started';
}

function moduleGroupKey(c: UserCourse): string {
  return (c.moduleId ?? c.moduleSlug ?? c.module ?? c.moduleName ?? '__other__').trim() || '__other__';
}

function moduleTitle(c: UserCourse, hi: boolean): string {
  const t = c.moduleName?.trim();
  if (t) return t;
  const slug = c.moduleSlug ?? c.module;
  if (slug) return slug;
  return hi ? 'अन्य' : 'Other';
}

type StatusFilter = 'all' | 'completed' | 'in_progress' | 'not_started';

function CourseCardSkeleton() {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="dashboard-shimmer h-48 bg-slate-100/70 dark:bg-white/[0.04]" />
      <div className="space-y-3 p-5">
        <div className="dashboard-shimmer h-5 w-2/3 rounded-lg bg-slate-100 dark:bg-white/[0.05]" />
        <div className="dashboard-shimmer h-3 w-full rounded bg-slate-100 dark:bg-white/[0.05]" />
        <div className="dashboard-shimmer h-10 w-full rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
      </div>
    </GlassPanel>
  );
}

type CourseCardItemProps = { course: UserCourse; locale: string; hi: boolean; listIndex?: number };

function CourseCardItem({ course, locale, hi, listIndex }: CourseCardItemProps) {
  const cover = course.imageUrl ?? course.moduleImageUrl;
  const progress = courseProgress(course);
  const status = courseStatus(course);
  const detailHref = `/${locale}/dashboard/courses/${encodeURIComponent(course.id)}`;
  const moduleSlug = course.moduleSlug ?? course.module;
  const moduleHref = moduleSlug ? `/${locale}/dashboard/modules/${encodeURIComponent(moduleSlug)}` : null;

  return (
    <ParallaxCard className="h-full">
      <GlassPanel className="group flex h-full flex-col overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          {cover ? (
            <>
              <Image
                src={cover}
                alt={course.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-blue-600/70 to-cyan-500/80">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_45%,rgba(255,255,255,0.05)_100%)]" />
              <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {typeof listIndex === 'number' ? (
              <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {String(listIndex + 1).padStart(2, '0')}
              </span>
            ) : null}
            {course.termTitle ? (
              <span className="rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                {course.termTitle}
              </span>
            ) : null}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-2 text-base font-bold text-white drop-shadow-sm">{course.name}</h3>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-4">
          {course.description ? (
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{course.description}</p>
          ) : (
            <p className="line-clamp-2 text-xs text-slate-500">{hi ? 'विवरण उपलब्ध' : 'Details on next screen'}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                status === 'completed' && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                status === 'in_progress' && 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
                status === 'not_started' && 'bg-slate-200/80 text-slate-600 dark:bg-white/[0.08] dark:text-slate-400'
              )}
            >
              {status === 'completed' ? (hi ? 'पूर्ण' : 'Done') : status === 'in_progress' ? (hi ? 'चालू' : 'Active') : hi ? 'नया' : 'New'}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{progress}%</span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={detailHref}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              {hi ? 'खोलें' : 'Open'}
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            {moduleHref ? (
              <Link
                href={moduleHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:border-white/[0.1] dark:text-slate-200"
              >
                {hi ? 'मॉड्यूल' : 'Module'}
              </Link>
            ) : null}
          </div>
        </div>
      </GlassPanel>
    </ParallaxCard>
  );
}

export default function MyCoursesPage() {
  const locale = useLocale();
  const hi = locale === 'hi';
  const [courses, setCourses] = useState<UserCourse[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getAllMyCourses();
        if (!cancelled) {
          setCourses(list);
          setLoadError(false);
        }
      } catch {
        if (!cancelled) {
          setCourses([]);
          setLoadError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const moduleOptions = useMemo(() => {
    const list = courses ?? [];
    const map = new Map<string, { key: string; title: string }>();
    for (const c of list) {
      const key = moduleGroupKey(c);
      if (!map.has(key)) map.set(key, { key, title: moduleTitle(c, hi) });
    }
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [courses, hi]);

  const filteredCourses = useMemo(() => {
    const list = courses ?? [];
    const q = searchQuery.trim().toLowerCase();
    return list.filter((c) => {
      if (moduleFilter !== 'all' && moduleGroupKey(c) !== moduleFilter) return false;
      if (statusFilter !== 'all' && courseStatus(c) !== statusFilter) return false;
      if (q) {
        const hay = [c.name, c.description, c.moduleName, c.moduleSlug, c.module, c.termTitle]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [courses, searchQuery, statusFilter, moduleFilter]);

  const modulesGrouped = useMemo(() => {
    const map = new Map<
      string,
      { key: string; title: string; slug: string | null; cover: string | null; courses: UserCourse[] }
    >();
    for (const c of filteredCourses) {
      const key = moduleGroupKey(c);
      let g = map.get(key);
      if (!g) {
        g = {
          key,
          title: moduleTitle(c, hi),
          slug: c.moduleSlug ?? c.module ?? null,
          cover: c.moduleImageUrl ?? c.imageUrl ?? null,
          courses: [],
        };
        map.set(key, g);
      }
      g.courses.push(c);
    }
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredCourses, hi]);

  const stats = useMemo(() => {
    const list = filteredCourses;
    const enrolled = list.length;
    const inProgress = list.filter((c) => courseStatus(c) === 'in_progress').length;
    const completed = list.filter((c) => courseStatus(c) === 'completed').length;
    return { enrolled, inProgress, completed };
  }, [filteredCourses]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const hasFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || moduleFilter !== 'all';

  const statCards = [
    {
      key: 'enrolled',
      title: hi ? 'नामांकित' : 'Enrolled',
      value: stats.enrolled,
      subtitle: hasFilters ? (hi ? 'फ़िल्टर अनुसार' : 'Matching filters') : hi ? 'कुल कोर्स' : 'Total courses',
      accent: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      key: 'progress',
      title: hi ? 'प्रगति में' : 'In progress',
      value: stats.inProgress,
      subtitle: hi ? 'सक्रिय सीखना' : 'Active learning',
      accent: 'from-violet-500 to-indigo-600',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      key: 'done',
      title: hi ? 'पूर्ण' : 'Completed',
      value: stats.completed,
      subtitle: hi ? 'शानदार काम' : 'Great momentum',
      accent: 'from-emerald-500 to-teal-600',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B1220] dark:text-slate-100">
      <style>{`
        @keyframes coursesGridMove {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-10px,0); }
          100% { transform: translate3d(0,0,0); }
        }
        @keyframes coursesGlow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes coursesShimmer {
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
          animation: coursesShimmer 1.6s linear infinite;
        }
        .dark .dashboard-shimmer {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.08) 50%,
            rgba(255,255,255,0) 100%
          );
        }
        select.course-filter-select option {
          background-color: #f1f5f9;
          color: #0f172a;
          font-weight: 600;
          padding: 0.35rem 0.5rem;
        }
        .dark select.course-filter-select option {
          background-color: #020617;
          color: #ecfeff;
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
            animation: 'coursesGridMove 16s ease-in-out infinite',
          }}
        />
        <div
          className="absolute left-[16%] top-[-5rem] h-80 w-80 rounded-full bg-blue-500/10 blur-[110px] dark:bg-blue-500/18"
          style={{ animation: 'coursesGlow 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[8%] right-[10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px] dark:bg-cyan-500/16"
          style={{ animation: 'coursesGlow 10s ease-in-out infinite' }}
        />
      </div>

      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full px-3 pb-10 pt-[88px] sm:px-4 sm:pb-12 sm:pt-[92px] lg:ml-64 lg:w-auto lg:max-w-none lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto w-full max-w-[1680px] space-y-8">
          <motion.section variants={item}>
            <GlassPanel className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.18),transparent_28%)]" />
              <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-cyan-400/10 dark:bg-white/[0.04] dark:text-cyan-300/90">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    {hi ? 'मेरे पाठ्यक्रम' : 'My courses'}
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white lg:text-4xl">
                    <span className="bg-gradient-to-r from-slate-950 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-cyan-300">
                      {hi ? 'आपकी लर्निंग लाइब्रेरी' : 'Your learning library'}
                    </span>
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 lg:text-base">
                    {hi
                      ? 'सभी नामांकित कोर्स, लाइव प्रगति और एक क्लिक में विवरण — डैशबोर्ड जैसा प्रीमियम अनुभव।'
                      : 'Every enrolled course, live progress, and rich detail in one place — the same premium feel as your dashboard.'}
                  </p>
                </div>
                <Link
                  href={`/${locale}/dashboard`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-300/50 hover:text-blue-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-cyan-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {hi ? 'डैशबोर्ड' : 'Dashboard'}
                </Link>
              </div>
            </GlassPanel>
          </motion.section>

          <motion.section variants={item}>
            <SectionHeading
              title={hi ? 'तेज़ सारांश' : 'At a glance'}
              subtitle={hi ? 'आपकी गति एक नज़र में' : 'Momentum in one snapshot'}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statCards.map((s) => (
                <ParallaxCard key={s.key} className="h-full">
                  <GlassPanel className="h-full p-5">
                    <div className="relative z-10">
                      <div className={cn('mb-4 inline-flex w-fit rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg', s.accent)}>{s.icon}</div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{s.title}</p>
                      <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                        <AnimatedNumber value={s.value} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.subtitle}</p>
                    </div>
                  </GlassPanel>
                </ParallaxCard>
              ))}
            </div>
          </motion.section>

          <motion.section variants={item}>
            <SectionHeading
              title={hi ? 'मॉड्यूल के अनुसार' : 'By module'}
              subtitle={
                hasFilters && courses && courses.length !== filteredCourses.length
                  ? hi
                    ? `${filteredCourses.length} दिख रहे, कुल ${courses.length}`
                    : `${filteredCourses.length} shown of ${courses.length}`
                  : hi
                    ? 'फ़िल्टर करें और मॉड्यूल के तहत ब्राउज़ करें'
                    : 'Filter and browse courses grouped by module'
              }
              action={
                courses !== null && courses.length > 0 ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {filteredCourses.length}
                    {hasFilters && courses.length !== filteredCourses.length ? ` / ${courses.length}` : ''}{' '}
                    {hi ? 'कोर्स' : 'courses'}
                  </span>
                ) : null
              }
            />

            {courses !== null && courses.length > 0 && !loadError ? (
              <GlassPanel className="mb-6 p-4 lg:p-5">
                <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
                  <label className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {hi ? 'खोज' : 'Search'}
                    </span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={hi ? 'नाम, विवरण, मॉड्यूल…' : 'Name, description, module…'}
                      className="w-full rounded-xl border border-slate-200/90 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-blue-500/0 transition-[box-shadow,border-color] placeholder:text-slate-400 focus:border-blue-400/80 focus:ring-2 focus:ring-blue-500/25 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </label>
                  <label className="flex w-full flex-col gap-2 lg:w-48">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {hi ? 'स्थिति' : 'Status'}
                    </span>
                    <FilterSelect
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    >
                      <option value="all">{hi ? 'सभी' : 'All'}</option>
                      <option value="in_progress">{hi ? 'प्रगति में' : 'In progress'}</option>
                      <option value="not_started">{hi ? 'शुरू नहीं' : 'Not started'}</option>
                      <option value="completed">{hi ? 'पूर्ण' : 'Completed'}</option>
                    </FilterSelect>
                  </label>
                  <label className="flex w-full flex-col gap-2 lg:min-w-[13rem] lg:max-w-md">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {hi ? 'मॉड्यूल' : 'Module'}
                    </span>
                    <FilterSelect value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                      <option value="all">{hi ? 'सभी मॉड्यूल' : 'All modules'}</option>
                      {moduleOptions.map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.title}
                        </option>
                      ))}
                    </FilterSelect>
                  </label>
                  {hasFilters ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setModuleFilter('all');
                      }}
                      className="shrink-0 rounded-xl border border-slate-200/90 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300/50 hover:text-blue-600 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-cyan-300 lg:self-end"
                    >
                      {hi ? 'रीसेट' : 'Reset'}
                    </button>
                  ) : null}
                </div>
              </GlassPanel>
            ) : null}

            {loadError ? (
              <GlassPanel className="p-8 text-center">
                <p className="text-sm text-rose-600 dark:text-rose-300">
                  {hi ? 'कोर्स लोड नहीं हो सके। कृपया दोबारा प्रयास करें।' : 'Could not load courses. Please try again.'}
                </p>
              </GlassPanel>
            ) : null}

            {courses === null && !loadError ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            ) : null}

            {courses !== null && courses.length === 0 && !loadError ? (
              <GlassPanel className="p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  {hi ? 'अभी कोई कोर्स नहीं मिला। नामांकन के बाद यहाँ दिखेगा।' : 'No courses yet. They will appear here once you are enrolled.'}
                </p>
              </GlassPanel>
            ) : null}

            {courses !== null && courses.length > 0 && filteredCourses.length === 0 && !loadError ? (
              <GlassPanel className="p-10 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {hi ? 'इन फ़िल्टर से कोई कोर्स नहीं मिला।' : 'No courses match these filters.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setModuleFilter('all');
                  }}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  {hi ? 'फ़िल्टर साफ़ करें' : 'Clear filters'}
                </button>
              </GlassPanel>
            ) : null}

            {courses !== null && courses.length > 0 && filteredCourses.length > 0 ? (
              <div className="space-y-12">
                {modulesGrouped.map((mod) => {
                  const moduleHref = mod.slug ? `/${locale}/dashboard/modules/${encodeURIComponent(mod.slug)}` : null;
                  return (
                    <section key={mod.key}>
                      <div className="mb-5 flex flex-wrap items-center gap-4 border-b border-slate-200/80 pb-4 dark:border-white/[0.08]">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04]">
                          {mod.cover ? (
                            <Image src={mod.cover} alt="" fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/90 to-cyan-500/80" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                            {mod.courses.length} {hi ? 'कोर्स' : mod.courses.length === 1 ? 'course' : 'courses'}
                          </p>
                        </div>
                        {moduleHref ? (
                          <Link
                            href={moduleHref}
                            className="shrink-0 rounded-full border border-slate-200/80 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300/50 hover:text-blue-600 dark:border-white/[0.1] dark:text-slate-200 dark:hover:text-cyan-300"
                          >
                            {hi ? 'मॉड्यूल देखें' : 'View module'}
                          </Link>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {mod.courses.map((course, index) => (
                          <CourseCardItem
                            key={course.id}
                            course={course}
                            locale={locale}
                            hi={hi}
                            listIndex={index}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : null}
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
