'use client';

import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useDashboardUser } from '@/components/DashboardUserContext';
import {
  ApiError,
  extractSpecialityIdFromUser,
  getMyCourses,
  getModuleTerms,
  getStoredSpecialityId,
  persistSpecialityIdFromMe,
  type UserCourse,
  type ModuleTerm,
} from '@/lib/api';

/* ─────────────────────────────────────────────────────────── */
/* Helpers                                                      */
/* ─────────────────────────────────────────────────────────── */

function formatDuration(sec?: number | null): string {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  if (m > 0) return `${m} min`;
  return `${sec}s`;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

type CourseStatus = 'completed' | 'in_progress' | 'not_started';
function courseStatus(progress: number | undefined): CourseStatus {
  const p = progress ?? 0;
  if (p >= 100) return 'completed';
  if (p > 0) return 'in_progress';
  return 'not_started';
}

const ACCENT_PAIRS = [
  { gradient: 'from-indigo-500 to-violet-600', ring: 'ring-indigo-200 dark:ring-indigo-500/30', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/25' },
  { gradient: 'from-sky-500 to-blue-600',      ring: 'ring-sky-200 dark:ring-sky-500/30',      badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/25' },
  { gradient: 'from-emerald-500 to-teal-600',  ring: 'ring-emerald-200 dark:ring-emerald-500/30', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25' },
  { gradient: 'from-rose-500 to-pink-600',     ring: 'ring-rose-200 dark:ring-rose-500/30',    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/25' },
  { gradient: 'from-amber-500 to-orange-600',  ring: 'ring-amber-200 dark:ring-amber-500/30',  badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25' },
  { gradient: 'from-fuchsia-500 to-purple-600',ring: 'ring-fuchsia-200 dark:ring-fuchsia-500/30', badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:border-fuchsia-500/25' },
];

function getAccent(idx: number) {
  return ACCENT_PAIRS[idx % ACCENT_PAIRS.length]!;
}

const STATUS_STYLES: Record<CourseStatus, { label: { en: string; hi: string }; cls: string }> = {
  completed:   { label: { en: 'Completed',   hi: 'पूर्ण'     }, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25' },
  in_progress: { label: { en: 'In progress', hi: 'जारी'      }, cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25' },
  not_started: { label: { en: 'Not started', hi: 'शुरू नहीं' }, cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/[0.08]' },
};

/* ─────────────────────────────────────────────────────────── */
/* Course card                                                  */
/* ─────────────────────────────────────────────────────────── */

interface CourseCardProps { course: UserCourse; idx: number; locale: string; }

function CourseCard({ course, idx, locale }: CourseCardProps) {
  const { gradient, ring, badge } = getAccent(idx);
  const status = courseStatus(course.progress);
  const progress = Math.min(100, Math.max(0, course.progress ?? 0));
  const statusStyle = STATUS_STYLES[status];
  const ctaLabel = progress === 0
    ? (locale === 'hi' ? 'शुरू करें' : 'Start course')
    : progress >= 100
      ? (locale === 'hi' ? 'दोबारा देखें' : 'Review')
      : (locale === 'hi' ? 'जारी रखें' : 'Continue');

  const coverSrc = course.imageUrl ?? course.moduleImageUrl;

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden
      border border-slate-200 dark:border-white/[0.07]
      bg-white dark:bg-[#111827]
      shadow-sm hover:shadow-xl dark:hover:shadow-black/40
      hover:-translate-y-1 transition-all duration-300">

      {/* Visual header */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {coverSrc ? (
          <>
            <Image
              src={coverSrc}
              alt={course.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
        )}

        {/* Order badge */}
        {course.order !== undefined && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
              bg-white/20 dark:bg-black/30 backdrop-blur-sm border border-white/30
              text-white font-bold text-sm shadow-sm">
              {course.order}
            </span>
          </div>
        )}

        {/* Published / draft */}
        {course.isPublished === false && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-[10px] font-bold uppercase tracking-wide">
              Draft
            </span>
          </div>
        )}

        {/* Title overlay if has image */}
        {coverSrc && (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-base font-bold text-white leading-snug drop-shadow line-clamp-2">
              {course.name}
            </h3>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Title (no image) */}
        {!coverSrc && (
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {course.name}
          </h3>
        )}

        {/* Status + Duration row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle.cls}`}>
            {locale === 'hi' ? statusStyle.label.hi : statusStyle.label.en}
          </span>
          {course.durationSec && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(course.durationSec)}
            </span>
          )}
        </div>

        {/* Description */}
        {course.description && course.description.trim() && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Meta: module + date */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          {course.moduleName && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
              </svg>
              {course.moduleName}
            </span>
          )}
          {course.createdAt && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(course.createdAt)}
            </span>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1.5">
            <span className="text-slate-400 dark:text-slate-500">{locale === 'hi' ? 'प्रगति' : 'Progress'}</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-1">
          <Link
            href={`/${locale}/dashboard/courses/${encodeURIComponent(course.id)}`}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
              bg-gradient-to-r ${gradient} text-white text-sm font-semibold
              shadow-md hover:shadow-lg group-hover:opacity-95 transition-all duration-300`}
          >
            {ctaLabel}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Skeleton                                                     */
/* ─────────────────────────────────────────────────────────── */

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111827] animate-pulse">
      <div className="aspect-[16/9] bg-slate-100 dark:bg-white/[0.06]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-white/[0.06] rounded-lg w-2/3" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-100 dark:bg-white/[0.04] rounded-full w-20" />
          <div className="h-5 bg-slate-100 dark:bg-white/[0.04] rounded-full w-14" />
        </div>
        <div className="h-3 bg-slate-100 dark:bg-white/[0.04] rounded w-full" />
        <div className="h-1.5 bg-slate-100 dark:bg-white/[0.04] rounded-full" />
        <div className="h-10 bg-slate-100 dark:bg-white/[0.06] rounded-xl mt-2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Stat chip (same as module page)                             */
/* ─────────────────────────────────────────────────────────── */

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
      bg-white/80 dark:bg-white/[0.08] backdrop-blur-sm
      border border-slate-200/80 dark:border-white/[0.12]
      text-slate-700 dark:text-white/80 shadow-sm">
      {icon}
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Page                                                         */
/* ─────────────────────────────────────────────────────────── */

export default function ModuleTermCoursesPage() {
  const params = useParams();
  const locale = useLocale();
  const moduleId  = typeof params.slug         === 'string' ? params.slug         : '';
  const termId    = typeof params.trimesterId  === 'string' ? params.trimesterId  : '';
  const user = useDashboardUser();

  const [courses, setCourses]     = useState<UserCourse[] | null>(null);
  const [termMeta, setTermMeta]   = useState<ModuleTerm | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!termId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const coursesData = await getMyCourses(termId, { moduleId });
        if (cancelled) return;
        setCourses(coursesData);

        // Try to fetch term metadata for banner info
        if (user) persistSpecialityIdFromMe(user);
        const sid =
          getStoredSpecialityId() ?? (user ? extractSpecialityIdFromUser(user) : null);
        if (moduleId) {
          try {
            const terms = await getModuleTerms(moduleId, sid);
            const t = terms.find((x) => x.id === termId) ?? terms[0] ?? null;
            if (!cancelled) setTermMeta(t);
          } catch {
            // non-critical
          }
        }
      } catch (e) {
        if (!cancelled) {
          setCourses(null);
          setError(e instanceof ApiError ? 'api' : 'unknown');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [termId, moduleId, user]);

  // Derive term title + banner image from various sources
  const termTitle = useMemo(() => {
    if (termMeta?.name) return termMeta.name;
    // from courses[0].termTitle
    if (courses && courses.length > 0 && courses[0]?.termTitle) return courses[0].termTitle;
    return locale === 'hi' ? 'टर्म' : 'Term';
  }, [termMeta, courses, locale]);

  const bannerImage = useMemo(() => {
    if (termMeta?.imageUrl) return termMeta.imageUrl;
    // fall back to module image from any course
    if (courses && courses.length > 0) {
      const withImg = courses.find((c) => c.moduleImageUrl);
      if (withImg?.moduleImageUrl) return withImg.moduleImageUrl;
    }
    return null;
  }, [termMeta, courses]);

  const moduleName = useMemo(() => {
    if (courses && courses.length > 0) {
      const n = courses.find((c) => c.moduleName)?.moduleName;
      if (n) return n;
    }
    return null;
  }, [courses]);

  const publishedCount = useMemo(
    () => courses?.filter((c) => c.isPublished !== false).length ?? 0,
    [courses]
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0a0f1e] dark:text-white">
      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full lg:ml-64 lg:w-auto lg:max-w-none">

        {/* ════════════════════════════════════════════════
            HERO BANNER
        ════════════════════════════════════════════════ */}
        <div className="relative w-full overflow-hidden">

          {/* Background */}
          {bannerImage ? (
            <>
              <Image
                src={bannerImage}
                alt={termTitle}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t
                from-slate-50 via-slate-50/40 to-transparent
                dark:from-[#0a0f1e] dark:via-[#0a0f1e]/60 dark:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r
                from-slate-50/70 to-transparent
                dark:from-[#0a0f1e]/70 dark:to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0
              bg-gradient-to-br from-sky-50 via-white to-indigo-50
              dark:from-[#0d1230] dark:via-[#0a0f1e] dark:to-[#071825]">
              <div className="absolute inset-0 opacity-25 dark:opacity-15"
                style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              <div className="absolute top-0 left-1/3 w-80 h-80 bg-sky-300/25 dark:bg-sky-600/15 rounded-full blur-3xl" />
              <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 px-4 pt-8 pb-10 sm:px-6 sm:pb-12 lg:px-16" style={{ minHeight: 260 }}>

            {/* Back */}
            <Link
              href={`/${locale}/dashboard/modules/${encodeURIComponent(moduleId)}`}
              className="inline-flex items-center gap-2 text-sm font-medium
                text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white
                transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'hi' ? 'मॉड्यूल पर वापस' : 'Back to module'}
            </Link>

            <div className="max-w-3xl">
              {/* Breadcrumb-style subtitle */}
              {moduleName && (
                <p className="text-sm font-medium text-slate-500 dark:text-white/50 mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
                  </svg>
                  {moduleName}
                </p>
              )}

              {/* Title */}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {loading ? (
                  <span className="inline-block w-56 h-12 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
                ) : (
                  termTitle
                )}
              </h1>

              {/* Stat chips */}
              {!loading && courses !== null && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {courses.length > 0 && (
                    <StatChip
                      label={`${courses.length} ${locale === 'hi' ? 'पाठ्यक्रम' : courses.length === 1 ? 'Course' : 'Courses'}`}
                      icon={
                        <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                        </svg>
                      }
                    />
                  )}
                  {publishedCount > 0 && publishedCount !== courses.length && (
                    <StatChip
                      label={`${publishedCount} ${locale === 'hi' ? 'प्रकाशित' : 'Published'}`}
                      icon={
                        <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            CONTENT
        ════════════════════════════════════════════════ */}
        <div className="px-4 pb-12 sm:px-6 lg:px-16 lg:pb-16">

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-white/[0.06] mb-10" />

          {/* Errors */}
          {(error === 'api' || error === 'unknown') && (
            <div className="rounded-xl border border-rose-300 dark:border-rose-500/30
              bg-rose-50 dark:bg-rose-500/10 px-5 py-4 mb-8
              text-sm text-rose-700 dark:text-rose-300 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {locale === 'hi' ? 'पाठ्यक्रम लोड नहीं हो सके।' : 'Could not load courses for this term. Please try again.'}
            </div>
          )}

          {/* Section heading */}
          {!error && (
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block w-1 h-6 rounded-full bg-gradient-to-b from-sky-500 to-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {locale === 'hi' ? 'पाठ्यक्रम' : 'Courses'}
              </h2>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : courses && courses.length === 0 && !error ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24
                text-slate-400 dark:text-white/30">
                <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                </svg>
                <p className="text-base font-medium">
                  {locale === 'hi' ? 'इस टर्म के लिए कोई पाठ्यक्रम नहीं।' : 'No courses for this term yet.'}
                </p>
              </div>
            ) : (
              (courses ?? []).map((course, idx) => (
                <CourseCard key={course.id} course={course} idx={idx} locale={locale} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
