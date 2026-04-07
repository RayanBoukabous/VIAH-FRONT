'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import {
  getMyTerms,
  getMyCourses,
  deleteCourse,
  type UserTerm,
  type UserCourse,
} from '@/lib/api';

export default function TermCoursesPage() {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const params = useParams();
  const termId = typeof params.termId === 'string' ? params.termId : '';

  const [termMeta, setTermMeta] = useState<UserTerm | null>(null);
  const [courses, setCourses] = useState<UserCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<UserCourse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!termId) return;
      try {
        const [termsData, coursesData] = await Promise.all([getMyTerms(), getMyCourses(termId)]);
        if (cancelled) return;
        const found = termsData.find((x) => x.id === termId) ?? null;
        setTermMeta(found);
        setCourses(coursesData);
        setError(null);
      } catch {
        if (!cancelled) {
          setCourses(null);
          setTermMeta(null);
          setError(t('termCoursesPage.error'));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [termId, t]);

  const termTitle = useMemo(() => (termMeta?.name ?? termId) || '—', [termMeta, termId]);

  const courseHref = (c: UserCourse) => {
    const slug = c.module ?? c.moduleSlug;
    if (slug) return `/${locale}/dashboard/modules/${encodeURIComponent(slug)}`;
    return `/${locale}/dashboard/courses`;
  };

  const handleDelete = async () => {
    if (!confirming) return;
    setDeletingId(confirming.id);
    setDeleteError(null);
    try {
      await deleteCourse(confirming.id);
      setCourses((prev) => (prev ? prev.filter((x) => x.id !== confirming.id) : prev));
      setConfirming(null);
    } catch {
      setDeleteError(t('termCoursesPage.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#030B1A] text-slate-900 dark:text-slate-100">
      <div className="fixed inset-0 pointer-events-none dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(52,150,226,0.1),transparent_55%)]" />

      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-[88px] pb-12 px-4 lg:px-8 relative z-10">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href={`/${locale}/dashboard/terms`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary dark:text-cyan-400 hover:text-primary-dark dark:hover:text-cyan-300 mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('termCoursesPage.back')}
            </Link>

            {/* Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-violet-200 dark:border-violet-500/20 mb-10 shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 dark:from-violet-600/25 via-white dark:via-[#0a1628] to-blue-50 dark:to-blue-600/25" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/5 dark:bg-cyan-500/15 rounded-full blur-3xl" />
              <div className="relative px-8 py-10 lg:py-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600/80 dark:text-violet-300/80 mb-2">
                  {t('termCoursesPage.termLabel')}
                </p>
                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-primary-dark to-primary dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text text-transparent mb-2">
                  {termTitle}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">{t('termCoursesPage.subtitle')}</p>
              </div>
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-200">
              {error}
            </div>
          )}
          {deleteError && (
            <div className="mb-6 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-200">
              {deleteError}
            </div>
          )}

          {courses === null && !error && (
            <div className="flex items-center justify-center py-24 text-slate-500">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-violet-300 dark:border-violet-500/30 border-t-violet-500 dark:border-t-violet-400 animate-spin" />
                <p>{t('termCoursesPage.loading')}</p>
              </div>
            </div>
          )}

          {courses && courses.length === 0 && !error && (
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-8 py-16 text-center text-slate-500 shadow-sm dark:shadow-none">
              {t('termCoursesPage.empty')}
            </div>
          )}

          {courses && courses.length > 0 && (
            <div className="space-y-4">
              {courses.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] shadow-sm dark:shadow-none overflow-hidden hover:border-primary/20 dark:hover:border-blue-400/25 hover:shadow-md dark:hover:shadow-none transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                    <Link href={courseHref(c)} className="flex-1 min-w-0 text-left">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-200 transition-colors">
                        {c.name}
                      </h2>
                      {c.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                      )}
                      {typeof c.progress === 'number' && (
                        <div className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden max-w-xs">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                            style={{ width: `${Math.min(100, Math.max(0, c.progress))}%` }}
                          />
                        </div>
                      )}
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={courseHref(c)}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-sm shadow-primary/15"
                      >
                        {t('termCoursesPage.openCourse')}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirming(c)}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-rose-300 dark:border-rose-500/35 text-rose-500 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        {t('termCoursesPage.deleteCourse')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal
            aria-labelledby="confirm-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0a1628] p-6 shadow-2xl"
            >
              <h2 id="confirm-title" className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('termCoursesPage.confirmTitle')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t('termCoursesPage.confirmBody')}</p>
              <p className="text-sm font-medium text-primary dark:text-cyan-300/90 mb-6 truncate">{confirming.name}</p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-transparent transition-colors"
                >
                  {t('termCoursesPage.cancel')}
                </button>
                <button
                  type="button"
                  disabled={deletingId === confirming.id}
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50"
                >
                  {deletingId === confirming.id ? '…' : t('termCoursesPage.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
