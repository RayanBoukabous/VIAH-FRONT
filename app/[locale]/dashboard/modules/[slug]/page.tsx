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
  getModule,
  getModuleTerms,
  getStoredSpecialityId,
  persistSpecialityIdFromMe,
  type ModuleDetail,
  type ModuleTerm,
  type TermCourse,
} from '@/lib/api';

/* ─────────────────────────────────────────────────────────── */
/* Helpers                                                      */
/* ─────────────────────────────────────────────────────────── */

function formatDateRange(startDate?: string, endDate?: string, locale?: string): string {
  if (!startDate && !endDate) return '';
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  if (startDate && endDate) return `${fmt(startDate)} – ${fmt(endDate)}`;
  if (startDate) return `From ${fmt(startDate)}`;
  return `Until ${fmt(endDate!)}`;
}

function formatDuration(sec?: number): string {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${sec}s`;
}

const ACCENT_PAIRS: Array<{ light: string; dark: string; pill: string }> = [
  { light: 'from-violet-500 to-indigo-600',   dark: 'dark:from-violet-600 dark:to-indigo-700',   pill: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20' },
  { light: 'from-rose-500 to-pink-600',        dark: 'dark:from-rose-600 dark:to-pink-700',        pill: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20' },
  { light: 'from-emerald-500 to-teal-600',     dark: 'dark:from-emerald-600 dark:to-teal-700',     pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20' },
  { light: 'from-amber-500 to-orange-600',     dark: 'dark:from-amber-600 dark:to-orange-700',     pill: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20' },
  { light: 'from-sky-500 to-blue-600',         dark: 'dark:from-sky-600 dark:to-blue-700',         pill: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20' },
  { light: 'from-fuchsia-500 to-purple-600',   dark: 'dark:from-fuchsia-600 dark:to-purple-700',   pill: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:border-fuchsia-500/20' },
];

function accent(idx: number) {
  return ACCENT_PAIRS[idx % ACCENT_PAIRS.length]!;
}

/* ─────────────────────────────────────────────────────────── */
/* Course pill inside term card                                 */
/* ─────────────────────────────────────────────────────────── */

function CoursePill({ course, pillCls }: { course: TermCourse; pillCls: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border truncate max-w-[200px] ${pillCls}`}
      title={course.title}
    >
      {course.imageUrl ? (
        <span className="w-3.5 h-3.5 rounded-full overflow-hidden flex-shrink-0 relative">
          <Image src={course.imageUrl} alt="" fill className="object-cover" sizes="14px" />
        </span>
      ) : (
        <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
        </svg>
      )}
      <span className="truncate">{course.title}</span>
      {course.durationSec ? (
        <span className="opacity-50 flex-shrink-0">· {formatDuration(course.durationSec)}</span>
      ) : null}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Term card                                                    */
/* ─────────────────────────────────────────────────────────── */

interface TermCardProps { term: ModuleTerm; idx: number; moduleId: string; locale: string; }

function TermCard({ term, idx, moduleId, locale }: TermCardProps) {
  const { light, dark, pill } = accent(idx);
  const gradient = `${light} ${dark}`;
  const dateRange = formatDateRange(term.startDate, term.endDate, locale);
  const courseCount = term.courses?.length ?? 0;
  const progress = Math.min(100, Math.max(0, term.progress ?? 0));
  const hasProgress = typeof term.progress === 'number';

  return (
    <Link
      href={`/${locale}/dashboard/modules/${encodeURIComponent(moduleId)}/${encodeURIComponent(term.id)}`}
      className="group flex flex-col rounded-2xl overflow-hidden
        border border-slate-200 dark:border-white/[0.07]
        bg-white dark:bg-[#111827]
        shadow-sm hover:shadow-xl dark:hover:shadow-black/40
        hover:-translate-y-1 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* ── visual header ── */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {term.imageUrl ? (
          <>
            <Image
              src={term.imageUrl}
              alt={term.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </>
        ) : term.coverVideoUrl ? (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            <video
              src={term.coverVideoUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              autoPlay muted loop playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
          </div>
        )}

        {/* Term number badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
            bg-white/20 dark:bg-black/30 backdrop-blur-sm border border-white/30
            text-white font-bold text-sm shadow-sm">
            {term.termNumber ?? idx + 1}
          </span>
        </div>

        {/* Draft badge */}
        {term.isPublished === false && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-[10px] font-bold uppercase tracking-wide">
              Draft
            </span>
          </div>
        )}

        {/* Video play button */}
        {term.coverVideoUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm border border-white/40
              flex items-center justify-center group-hover:scale-90 transition-transform duration-300 shadow-lg">
              <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Title overlay (only when there's a visual background) */}
        {(term.imageUrl || term.coverVideoUrl) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-base font-bold text-white leading-snug drop-shadow line-clamp-2">
              {term.name}
            </h3>
          </div>
        )}
      </div>

      {/* ── card body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Title (when no visual overlay) */}
        {!term.imageUrl && !term.coverVideoUrl && (
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {term.name}
          </h3>
        )}

        {/* Description */}
        {term.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {term.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {dateRange && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dateRange}
            </span>
          )}
          {courseCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {courseCount} {locale === 'hi' ? 'पाठ' : courseCount === 1 ? 'course' : 'courses'}
            </span>
          )}
        </div>

        {/* Progress */}
        {hasProgress && (
          <div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 mb-1">
              <span>{locale === 'hi' ? 'प्रगति' : 'Progress'}</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Course pills */}
        {term.courses && term.courses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {term.courses.slice(0, 3).map((c) => (
              <CoursePill key={c.id} course={c} pillCls={pill} />
            ))}
            {term.courses.length > 3 && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${pill}`}>
                +{term.courses.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          <span className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
            bg-gradient-to-r ${gradient} text-white text-sm font-semibold
            shadow-md group-hover:shadow-lg transition-all duration-300`}>
            {locale === 'hi' ? 'खोलें' : 'Open Term'}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Skeleton                                                     */
/* ─────────────────────────────────────────────────────────── */

function TermCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111827] animate-pulse">
      <div className="aspect-[16/9] bg-slate-100 dark:bg-white/[0.06]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-white/[0.06] rounded-lg w-2/3" />
        <div className="h-3 bg-slate-100 dark:bg-white/[0.04] rounded w-full" />
        <div className="h-3 bg-slate-100 dark:bg-white/[0.04] rounded w-4/5" />
        <div className="h-1.5 bg-slate-100 dark:bg-white/[0.04] rounded-full" />
        <div className="h-10 bg-slate-100 dark:bg-white/[0.06] rounded-xl mt-4" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Stat chip                                                    */
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

export default function ModuleDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const moduleId = typeof params.slug === 'string' ? params.slug : '';
  const user = useDashboardUser();

  const [moduleDetail, setModuleDetail] = useState<ModuleDetail | null>(null);
  const [terms, setTerms] = useState<ModuleTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        /** Persist + resolve speciality: appended as ?specialityId= when present. */
        if (user) persistSpecialityIdFromMe(user);
        const sid =
          getStoredSpecialityId() ?? (user ? extractSpecialityIdFromUser(user) : null);

        const [detail, termList] = await Promise.all([
          getModule(moduleId).catch(() => null),
          getModuleTerms(moduleId, sid),
        ]);
        if (cancelled) return;
        setModuleDetail(detail);
        setTerms(termList);
      } catch (e) {
        if (!cancelled) setError(e instanceof ApiError ? 'api' : 'unknown');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [moduleId, user]);

  const displayTitle = useMemo(
    () => moduleDetail?.name || (moduleId.length > 8 ? `${moduleId.slice(0, 8)}…` : moduleId) || 'Module',
    [moduleDetail, moduleId]
  );

  const totalCourses = useMemo(
    () => terms.reduce((acc, t) => acc + (t.courses?.length ?? 0), 0),
    [terms]
  );

  const hasBannerImage = !!moduleDetail?.imageUrl;

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
          {hasBannerImage ? (
            <>
              <Image
                src={moduleDetail!.imageUrl!}
                alt={displayTitle}
                fill
                className="object-cover"
                priority
              />
              {/* Scrim — adapts to mode */}
              <div className="absolute inset-0 bg-gradient-to-t
                from-slate-50 via-slate-50/30 to-transparent
                dark:from-[#0a0f1e] dark:via-[#0a0f1e]/50 dark:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/60 to-transparent dark:from-[#0a0f1e]/60 dark:to-transparent" />
            </>
          ) : (
            /* Subtle geometric hero — looks great in both modes */
            <div className="absolute inset-0
              bg-gradient-to-br from-indigo-50 via-white to-sky-50
              dark:from-[#0d1230] dark:via-[#0a0f1e] dark:to-[#071825]">
              {/* Dot grid */}
              <div className="absolute inset-0 opacity-30 dark:opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              {/* Glow spots */}
              <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/15 rounded-full blur-3xl" />
              <div className="absolute top-0 right-1/4 w-64 h-64 bg-sky-300/20 dark:bg-cyan-600/10 rounded-full blur-3xl" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 px-4 pt-8 pb-10 sm:px-6 sm:pb-12 lg:px-16" style={{ minHeight: 280 }}>
            {/* Back button */}
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-2 text-sm font-medium
                text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white
                transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </Link>

            <div className="max-w-3xl">
              {/* Code pill */}
              {moduleDetail?.code && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4
                  bg-indigo-100 text-indigo-700 border border-indigo-200
                  dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/25 uppercase tracking-widest">
                  {moduleDetail.code}
                </span>
              )}

              {/* Title */}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {loading ? (
                  <span className="inline-block w-72 h-12 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
                ) : (
                  displayTitle
                )}
              </h1>

              {/* Description */}
              {moduleDetail?.description && (
                <p className="text-base lg:text-lg text-slate-500 dark:text-white/55 leading-relaxed mb-6 max-w-2xl">
                  {moduleDetail.description}
                </p>
              )}

              {/* Stat chips */}
              {!loading && (terms.length > 0 || totalCourses > 0) && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {terms.length > 0 && (
                    <StatChip
                      label={`${terms.length} ${locale === 'hi' ? 'टर्म' : terms.length === 1 ? 'Term' : 'Terms'}`}
                      icon={
                        <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      }
                    />
                  )}
                  {totalCourses > 0 && (
                    <StatChip
                      label={`${totalCourses} ${locale === 'hi' ? 'पाठ्यक्रम' : totalCourses === 1 ? 'Course' : 'Courses'}`}
                      icon={
                        <svg className="w-4 h-4 text-sky-500 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
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
              {locale === 'hi'
                ? 'टर्म लोड नहीं हो सके।'
                : 'Could not load terms for this module. Please try again.'}
            </div>
          )}

          {/* Section heading */}
          {!error && (
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-sky-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {locale === 'hi' ? 'मेरे टर्म' : 'My Terms'}
              </h2>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <TermCardSkeleton key={i} />)
            ) : terms.length === 0 && !error ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24
                text-slate-400 dark:text-white/30">
                <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-base font-medium">
                  {locale === 'hi' ? 'अभी कोई टर्म उपलब्ध नहीं।' : 'No terms available for this module yet.'}
                </p>
              </div>
            ) : (
              terms.map((term, idx) => (
                <TermCard key={term.id} term={term} idx={idx} moduleId={moduleId} locale={locale} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
