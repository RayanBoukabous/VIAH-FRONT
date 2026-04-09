'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { CoursePdfViewer } from '@/components/dashboard/CoursePdfViewer';
import { getCourse, type CourseDetail, type CourseResource } from '@/lib/api';

function resourceTypeLabel(type: string, locale: string): string {
  const map: Record<string, { en: string; hi: string }> = {
    DOCUMENT: { en: 'Documents', hi: 'दस्तावेज़' },
    VIDEO: { en: 'Videos', hi: 'वीडियो' },
    AUDIO: { en: 'Audio', hi: 'ऑडियो' },
    LINK: { en: 'Links', hi: 'लिंक' },
    OTHER: { en: 'Other', hi: 'अन्य' },
  };
  const m = map[type];
  if (m) return locale === 'hi' ? m.hi : m.en;
  return type.replace(/_/g, ' ');
}

function OtherResourceCard({ resource, locale }: { resource: CourseResource; locale: string }) {
  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-white/[0.08]
        bg-white dark:bg-[#111827] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
          bg-indigo-50 text-indigo-700 border border-indigo-100
          dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
          {resource.type}
        </span>
        {resource.order !== undefined && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            #{resource.order}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
        {resource.title}
      </h3>
      {resource.url?.trim() && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 break-all font-mono">{resource.url}</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Helpers                                                      */
/* ─────────────────────────────────────────────────────────── */

function formatDuration(sec?: number): string {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  if (m > 0) return `${m} min`;
  return `${sec}s`;
}

function formatDate(iso?: string, locale = 'en'): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

type CourseStatus = 'completed' | 'in_progress' | 'not_started';
function getStatus(progress: number | undefined): CourseStatus {
  const p = progress ?? 0;
  if (p >= 100) return 'completed';
  if (p > 0) return 'in_progress';
  return 'not_started';
}

const STATUS_STYLES: Record<CourseStatus, { en: string; hi: string; cls: string }> = {
  completed:   { en: 'Completed',   hi: 'पूर्ण',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25' },
  in_progress: { en: 'In progress', hi: 'जारी',       cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25' },
  not_started: { en: 'Not started', hi: 'शुरू नहीं',  cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/[0.08]' },
};

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
/* Info row item                                                */
/* ─────────────────────────────────────────────────────────── */

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Skeleton                                                     */
/* ─────────────────────────────────────────────────────────── */

function PageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Banner skeleton */}
      <div className="w-full h-[340px] bg-slate-100 dark:bg-white/[0.05]" />
      <div className="space-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-16">
        <div className="h-px bg-slate-200 dark:bg-white/[0.06]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-slate-100 dark:bg-white/[0.06] rounded-lg w-1/3" />
            <div className="h-4 bg-slate-100 dark:bg-white/[0.04] rounded w-full" />
            <div className="h-4 bg-slate-100 dark:bg-white/[0.04] rounded w-4/5" />
            <div className="h-4 bg-slate-100 dark:bg-white/[0.04] rounded w-3/5" />
          </div>
          <div className="space-y-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06]" />
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 bg-slate-100 dark:bg-white/[0.04] rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-white/[0.06] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Page                                                         */
/* ─────────────────────────────────────────────────────────── */

export default function CourseDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedResourceId(null);
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getCourse(courseId);
        if (!cancelled) setCourse(data);
      } catch {
        if (!cancelled) { setCourse(null); setError(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [courseId]);

  const progress = Math.min(100, Math.max(0, course?.progress ?? 0));
  const status = getStatus(course?.progress);
  const statusStyle = STATUS_STYLES[status];
  const bannerSrc = course?.imageUrl ?? course?.moduleImageUrl ?? null;

  const infoItems = useMemo(() => {
    if (!course) return [];
    const items: { icon: React.ReactNode; label: string; value: string }[] = [];

    if (course.moduleName) items.push({
      label: locale === 'hi' ? 'मॉड्यूल' : 'Module',
      value: course.moduleName,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" /></svg>,
    });
    if (course.termTitle) items.push({
      label: locale === 'hi' ? 'टर्म' : 'Term',
      value: course.termTitle,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    });
    if (course.durationSec) items.push({
      label: locale === 'hi' ? 'अवधि' : 'Duration',
      value: formatDuration(course.durationSec),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    });
    if (course.order !== undefined) items.push({
      label: locale === 'hi' ? 'क्रम' : 'Order',
      value: `#${course.order}`,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>,
    });
    if (course.createdAt) items.push({
      label: locale === 'hi' ? 'बनाई गई' : 'Created',
      value: formatDate(course.createdAt, locale),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    });
    if (course.updatedAt && course.updatedAt !== course.createdAt) items.push({
      label: locale === 'hi' ? 'अपडेट की गई' : 'Updated',
      value: formatDate(course.updatedAt, locale),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    });
    if (course.createdBy) items.push({
      label: locale === 'hi' ? 'बनाया' : 'Created by',
      value: course.createdBy,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    });
    if (course.updatedBy && course.updatedBy !== course.createdBy) items.push({
      label: locale === 'hi' ? 'अपडेट किया' : 'Updated by',
      value: course.updatedBy,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    });
    return items;
  }, [course, locale]);

  const { resourceTypes, resourcesByType } = useMemo(() => {
    const list = course?.resources ?? [];
    const m = new Map<string, CourseResource[]>();
    for (const r of list) {
      const t = r.type || 'OTHER';
      if (!m.has(t)) m.set(t, []);
      m.get(t)!.push(r);
    }
    Array.from(m.values()).forEach((arr) => arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    const order = ['DOCUMENT', 'VIDEO', 'AUDIO', 'LINK', 'OTHER'];
    const types = Array.from(m.keys()).sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return { resourceTypes: types, resourcesByType: m };
  }, [course]);

  const selectedResource = useMemo(() => {
    if (!course || !selectedResourceId) return null;
    return course.resources?.find((r) => r.id === selectedResourceId) ?? null;
  }, [course, selectedResourceId]);

  useEffect(() => {
    if (!course) return;
    const tab = resourceTypes.includes('DOCUMENT')
      ? 'rtype:DOCUMENT'
      : resourceTypes[0]
        ? `rtype:${resourceTypes[0]}`
        : '';
    if (tab) setActiveTab(tab);
    const docs = resourcesByType.get('DOCUMENT') ?? [];
    const first =
      docs[0] ?? (resourceTypes[0] ? resourcesByType.get(resourceTypes[0])?.[0] : undefined);
    if (first) setSelectedResourceId(first.id);
  }, [course, resourceTypes, resourcesByType]);

  const selectTab = useCallback(
    (tid: string) => {
      setActiveTab(tid);
      const type = tid.replace(/^rtype:/, '');
      const list = resourcesByType.get(type) ?? [];
      if (list[0]) setSelectedResourceId(list[0].id);
    },
    [resourcesByType]
  );

  // Back href: prefer term page if we have enough info
  const backHref = useMemo(() => {
    if (course?.moduleId && course?.termId)
      return `/${locale}/dashboard/modules/${encodeURIComponent(course.moduleId)}/${encodeURIComponent(course.termId)}`;
    return `/${locale}/dashboard`;
  }, [course, locale]);

  const backLabel = course?.termTitle
    ? (locale === 'hi' ? `${course.termTitle} पर वापस` : `Back to ${course.termTitle}`)
    : (locale === 'hi' ? 'वापस' : 'Back');

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0a0f1e] dark:text-white">
      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full lg:ml-64 lg:w-auto lg:max-w-none">

        {loading && <PageSkeleton />}

        {error && !loading && (
          <div className="px-4 pt-16 sm:px-6 lg:px-16">
            <div className="rounded-xl border border-rose-300 dark:border-rose-500/30
              bg-rose-50 dark:bg-rose-500/10 px-5 py-4
              text-sm text-rose-700 dark:text-rose-300 flex items-start gap-3 max-w-lg">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {locale === 'hi' ? 'पाठ्यक्रम लोड नहीं हो सका।' : 'Could not load this course.'}
            </div>
          </div>
        )}

        {!loading && !error && course && (
          <>
            {/* ══════════════════════════════════════════════
                HERO BANNER — full width
            ══════════════════════════════════════════════ */}
            <div className="relative w-full overflow-hidden">

              {/* Background */}
              {bannerSrc ? (
                <>
                  <Image
                    src={bannerSrc}
                    alt={course.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t
                    from-slate-50 via-slate-50/40 to-transparent
                    dark:from-[#0a0f1e] dark:via-[#0a0f1e]/60 dark:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r
                    from-slate-50/80 via-slate-50/20 to-transparent
                    dark:from-[#0a0f1e]/80 dark:via-transparent dark:to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0
                  bg-gradient-to-br from-violet-50 via-white to-indigo-50
                  dark:from-[#130d2a] dark:via-[#0a0f1e] dark:to-[#081525]">
                  <div className="absolute inset-0 opacity-25 dark:opacity-15"
                    style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                  <div className="absolute top-0 left-1/3 w-80 h-80 bg-violet-300/20 dark:bg-violet-600/15 rounded-full blur-3xl" />
                  <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl" />
                </div>
              )}

              {/* Hero content */}
              <div className="relative z-10 px-4 pt-8 pb-10 sm:px-6 sm:pb-12 lg:px-16" style={{ minHeight: 280 }}>

                {/* Back */}
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 text-sm font-medium
                    text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white
                    transition-colors mb-8"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {backLabel}
                </Link>

                <div className="flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 max-w-3xl flex-1">
                  {/* Breadcrumb line */}
                  {(course.moduleName || course.termTitle) && (
                    <p className="text-sm text-slate-500 dark:text-white/45 mb-2 flex items-center gap-1.5 flex-wrap">
                      {course.moduleName && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
                          </svg>
                          {course.moduleName}
                        </span>
                      )}
                      {course.moduleName && course.termTitle && <span className="opacity-40">/</span>}
                      {course.termTitle && <span>{course.termTitle}</span>}
                    </p>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4
                    text-slate-900 dark:text-white">
                    {course.name}
                  </h1>

                  {/* Status + chips row */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {/* Status badge */}
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${statusStyle.cls}`}>
                      {locale === 'hi' ? statusStyle.hi : statusStyle.en}
                    </span>

                    {/* Draft badge */}
                    {course.isPublished === false && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold
                        bg-amber-50 text-amber-700 border border-amber-200
                        dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25">
                        Draft
                      </span>
                    )}

                    {/* Duration */}
                    {course.durationSec && (
                      <StatChip
                        label={formatDuration(course.durationSec)}
                        icon={
                          <svg className="w-4 h-4 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />
                    )}

                    {/* Order */}
                    {course.order !== undefined && (
                      <StatChip
                        label={`#${course.order}`}
                        icon={
                          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        }
                      />
                    )}
                  </div>
                  </div>

                  <Link
                    href={`/${locale}/login`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:shadow-black/30 dark:hover:bg-white/[0.14]"
                  >
                    {locale === 'hi' ? 'अभी शुरू करें' : 'Start now'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                CONTENT — resources + embedded PDF + course meta
            ══════════════════════════════════════════════ */}
            <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pb-16 w-full">

              <div className="h-px bg-slate-200 dark:bg-white/[0.06] mb-8" />

              {resourceTypes.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-1 mb-8">
                    {resourceTypes.map((type) => {
                      const tid = `rtype:${type}`;
                      const active = activeTab === tid;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => selectTab(tid)}
                          className={`relative px-4 py-2.5 rounded-t-lg text-sm font-semibold transition-colors ${
                            active
                              ? 'text-indigo-600 dark:text-indigo-300'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {resourceTypeLabel(type, locale)}
                          <span className="ml-1.5 text-xs font-medium opacity-60">
                            ({resourcesByType.get(type)?.length ?? 0})
                          </span>
                          {active && (
                            <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {activeTab === 'rtype:DOCUMENT' && (
                    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 mb-12 xl:items-stretch">
                      <aside
                        className="w-full xl:w-[280px] shrink-0 rounded-2xl border border-slate-200 dark:border-white/[0.08]
                          bg-white dark:bg-[#111827] p-3 shadow-sm"
                      >
                        <p className="px-2 pt-1 pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {locale === 'hi' ? 'दस्तावेज़' : 'Documents'}
                        </p>
                        <div className="flex flex-col gap-1 max-h-[min(320px,40vh)] xl:max-h-[72vh] overflow-y-auto pr-1">
                          {(resourcesByType.get('DOCUMENT') ?? []).map((r) => {
                            const sel = selectedResourceId === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setSelectedResourceId(r.id)}
                                className={`text-left rounded-xl px-3 py-3 transition-colors border ${
                                  sel
                                    ? 'border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500/30'
                                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                                }`}
                              >
                                <span className="block text-sm font-semibold text-slate-900 dark:text-white line-clamp-3">
                                  {r.title}
                                </span>
                                {r.order !== undefined && (
                                  <span className="mt-1 block text-[10px] text-slate-400">
                                    {locale === 'hi' ? 'क्रम' : 'Order'} #{r.order}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </aside>
                      <div className="min-w-0 flex-1 w-full">
                        {selectedResource?.url?.trim() ? (
                          <CoursePdfViewer
                            url={selectedResource.url.trim()}
                            title={selectedResource.title}
                            locale={locale}
                          />
                        ) : (
                          <div
                            className="flex min-h-[48vh] items-center justify-center rounded-2xl border border-dashed border-slate-200
                            dark:border-white/[0.1] bg-slate-50/50 dark:bg-white/[0.02] text-sm text-slate-500 px-6 text-center"
                          >
                            {locale === 'hi' ? 'इस दस्तावेज़ के लिए कोई URL नहीं।' : 'No file URL for this document.'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab && activeTab !== 'rtype:DOCUMENT' && (
                    <div className="mb-12 space-y-4">
                      {(resourcesByType.get(activeTab.replace(/^rtype:/, '')) ?? []).map((r) => (
                        <OtherResourceCard key={r.id} resource={r} locale={locale} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">
                  {locale === 'hi'
                    ? 'इस पाठ्यक्रम के लिए कोई संसाधन नहीं।'
                    : 'No resources for this course yet.'}
                </p>
              )}

              {/* Course id + progress + description + details — below viewer */}
              <div className="grid grid-cols-1 gap-10 border-t border-slate-200 dark:border-white/[0.06] pt-10 lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-1 space-y-8">
                  <section className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      ID
                    </p>
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">{course.id}</p>
                  </section>
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {locale === 'hi' ? 'प्रगति' : 'Progress'}
                      </h2>
                      <span
                        className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600
                        dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent tabular-nums"
                      >
                        {progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </section>
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                      <span className="inline-block w-0.5 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                      {locale === 'hi' ? 'विवरण' : 'Description'}
                    </h2>
                    {course.description && course.description.trim() ? (
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        <p className="whitespace-pre-wrap">{course.description}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                        {locale === 'hi' ? 'कोई विवरण उपलब्ध नहीं।' : 'No description provided.'}
                      </p>
                    )}
                  </section>
                  <Link
                    href={`/${locale}/login`}
                    className="flex w-full items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                      bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                      text-white shadow-lg shadow-indigo-500/20 transition-all duration-300"
                  >
                    {progress === 0
                      ? locale === 'hi'
                        ? 'अभी शुरू करें'
                        : 'Start now'
                      : progress >= 100
                        ? locale === 'hi'
                          ? 'दोबारा देखें'
                          : 'Review course'
                        : locale === 'hi'
                          ? 'जारी रखें'
                          : 'Continue learning'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111827] p-6 shadow-sm">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                      {locale === 'hi' ? 'विवरण' : 'Details'}
                    </h2>
                    <div className="space-y-4">
                      {infoItems.map((item, i) => (
                        <InfoItem key={i} icon={item.icon} label={item.label} value={item.value} />
                      ))}
                      {infoItems.length === 0 && (
                        <p className="text-sm text-slate-400 dark:text-slate-600">
                          {locale === 'hi' ? 'कोई विवरण नहीं।' : 'No additional details.'}
                        </p>
                      )}
                    </div>
                    {course.moduleImageUrl && (
                      <>
                        <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-5" />
                        <div className="rounded-xl overflow-hidden aspect-video relative max-w-lg">
                          <Image
                            src={course.moduleImageUrl}
                            alt={course.moduleName ?? ''}
                            fill
                            sizes="(max-width: 1024px) 100vw, 512px"
                            className="object-cover"
                          />
                          {course.moduleName && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                              <p className="text-white text-xs font-semibold truncate">{course.moduleName}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
