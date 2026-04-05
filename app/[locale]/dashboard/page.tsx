'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getMe, getMeDisplay, type AuthUser } from '@/lib/api';

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
      } catch (e) {
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

  // Metrics not yet provided by GET /auth/me — placeholders until a dedicated API exists
  const studyTimeToday = '2h 45min';
  const enrolledCourses = 10;
  const completedLessons = 58;
  const totalLessons = 142;
  const progress = 40.8;

  const stats = [
    {
      title: 'Study Time Today',
      value: studyTimeToday,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark',
    },
    {
      title: 'Enrolled Courses',
      value: `${enrolledCourses}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-primary-dark to-primary',
    },
    {
      title: 'Completed Lessons',
      value: `${completedLessons}/${totalLessons}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-primary-dark to-primary',
    },
    {
      title: 'Overall Progress',
      value: `${progress}%`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-72 pb-6 p-4 lg:p-6 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-200">
              {locale === 'hi'
                ? 'प्रोफ़ाइल लोड नहीं हो सकी।'
                : 'Could not load your profile from the API.'}
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 pt-20">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3 block leading-tight">
              {display ? (
                <>
                  {locale === 'hi' ? 'वापसी पर स्वागत है, ' : 'Welcome back, '}
                  <span className="text-primary dark:text-primary-light">{display.fullName}</span>!
                </>
              ) : (
                <span className="inline-block h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              )}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {locale === 'hi' ? 'आज के लिए आपका सीखने का सारांश' : "Here's your learning overview for today"}
            </p>
          </div>

          {/* Student Info Cards — driven by GET /auth/me */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
                  {display?.initials ?? '…'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white truncate">
                    {display?.fullName ?? '…'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {display?.email ?? '—'}
                  </p>
                  {display?.username && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">@{display.username}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {locale === 'hi' ? 'स्तर' : 'Level'}
                </p>
                <p className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  {display?.levelLabel ?? '—'}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {locale === 'hi' ? 'विशेषता' : 'Speciality'}
                </p>
                <p className="text-lg font-heading font-bold text-gray-900 dark:text-white leading-snug">
                  {display?.specialityLabel ?? '—'}
                </p>
              </div>
            </div>
          </div>

          {(display?.provider || lastLoginLabel) && (
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {display?.provider && (
                <span>
                  {locale === 'hi' ? 'प्रदाता: ' : 'Sign-in: '}
                  <span className="font-medium text-gray-800 dark:text-gray-200">{display.provider}</span>
                </span>
              )}
              {lastLoginLabel && (
                <span>
                  {locale === 'hi' ? 'अंतिम लॉगिन: ' : 'Last login: '}
                  <span className="font-medium text-gray-800 dark:text-gray-200">{lastLoginLabel}</span>
                </span>
              )}
            </div>
          )}

          {/* Stats Grid (not from /me yet) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-lg p-4 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                <div className="relative z-10">
                  <div className="mb-3 opacity-90">{stat.icon}</div>
                  <h3 className="text-xs font-medium mb-1 opacity-90">{stat.title}</h3>
                  <p className="text-2xl font-heading font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modules Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-heading font-bold text-gray-900 dark:text-white">
                {locale === 'hi' ? 'मेरे मॉड्यूल' : 'My Modules'}
              </h2>
              <button type="button" className="text-xs font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                {locale === 'hi' ? 'सभी देखें →' : 'View All →'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[{ id: 1, title: 'Mathematics', slug: 'mathematics' }].map((module) => (
                <div
                  key={module.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/80 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(52,150,226,0.25)] dark:hover:shadow-[0_20px_50px_-12px_rgba(52,150,226,0.15)] hover:-translate-y-1"
                >
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-primary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />

                  <div className="relative px-8 pt-10 pb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary-dark/15 dark:from-primary/20 dark:via-primary/10 dark:to-primary-dark/25" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 blur-2xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-500" />
                    <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-primary-dark/10 dark:bg-primary-dark/20 blur-xl" />
                    <div className="relative flex justify-center">
                      <div className="relative">
                        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                        <div className="relative flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-inner border border-white/60 dark:border-gray-600/50 ring-2 ring-primary/20 dark:ring-primary/30 group-hover:ring-primary/40 transition-all duration-500 group-hover:scale-105">
                          <svg className="w-14 h-14 text-primary dark:text-primary-light" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 20h32M20 20v28M44 20v28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative px-6 pb-6">
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1 text-center group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5 line-clamp-2">
                      {display && display.specialityLabel !== '—'
                        ? display.specialityLabel
                        : locale === 'hi'
                          ? 'बीजगणित, ज्यामिति और कलन'
                          : 'Algebra, geometry & calculus'}
                    </p>
                    <Link
                      href={`/${locale}/dashboard/modules/${module.slug}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:from-primary-dark hover:to-primary transition-all duration-300"
                    >
                      <span>{locale === 'hi' ? 'मॉड्यूल खोलें' : 'Access module'}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
