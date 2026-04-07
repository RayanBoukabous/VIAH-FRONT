'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getMyTerms, type UserTerm } from '@/lib/api';

export default function MyTermsPage() {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const [terms, setTerms] = useState<UserTerm[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyTerms();
        if (!cancelled) {
          setTerms(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setTerms(null);
          setError(t('termsPage.error'));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable copy on mount
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#030B1A] text-slate-900 dark:text-slate-100">
      <div className="fixed inset-0 pointer-events-none dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(52,150,226,0.1),transparent_55%)]" />

      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-[88px] pb-12 px-4 lg:px-8 relative z-10 min-h-[60vh]">
        <div className="w-full max-w-6xl mx-auto">
          {/* Banner — no opacity-0 initial state (avoids invisible content if motion/hydration fails) */}
          <div className="relative mb-10 rounded-3xl overflow-hidden border border-primary/15 dark:border-cyan-500/20 shadow-sm dark:shadow-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/8 dark:from-blue-600/30 via-white dark:via-[#0a1628] to-cyan-400/8 dark:to-cyan-600/20" />
            <div className="relative px-8 py-10 lg:py-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 dark:border-cyan-400/30 bg-primary/5 dark:bg-cyan-500/10 text-primary dark:text-cyan-300 text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-cyan-400 animate-pulse" />
                {t('termsPage.badge')}
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                {t('termsPage.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">{t('termsPage.subtitle')}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-200">
              {error}
            </div>
          )}

          {terms === null && !error && (
            <div className="flex items-center justify-center py-24 text-slate-500">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-primary/30 dark:border-cyan-500/30 border-t-primary dark:border-t-cyan-400 animate-spin" />
                <p>{t('termsPage.loading')}</p>
              </div>
            </div>
          )}

          {terms && terms.length === 0 && !error && (
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-8 py-16 text-center text-slate-500 shadow-sm dark:shadow-none">
              {t('termsPage.empty')}
            </div>
          )}

          {terms && terms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {terms.map((term, index) => (
                <div key={term.id}>
                  <Link
                    href={`/${locale}/dashboard/terms/${encodeURIComponent(term.id)}/courses`}
                    className="group block h-full rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-gradient-to-br dark:from-white/[0.06] dark:to-transparent p-6 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-cyan-500/35 hover:shadow-md dark:hover:shadow-[0_20px_50px_-20px_rgba(52,150,226,0.35)] hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, hsl(${210 + (index * 15) % 40}, 70%, 45%), hsl(${220 + (index * 20) % 30}, 75%, 38%))`,
                        }}
                      >
                        {(index % 6) + 1}
                      </div>
                      <span className="text-primary dark:text-cyan-400/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-cyan-100 transition-colors">
                      {term.name}
                    </h2>
                    {term.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{term.description}</p>
                    )}
                    {(term.startDate || term.endDate) && (
                      <p className="text-xs text-slate-500 mb-4">
                        {term.startDate && new Date(term.startDate).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
                        {term.startDate && term.endDate ? ' — ' : ''}
                        {term.endDate && new Date(term.endDate).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-cyan-400">
                      {t('termsPage.viewCourses')}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
