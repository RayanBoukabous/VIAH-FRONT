'use client';

import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

const MODULE_NAMES: Record<string, string> = {
  mathematics: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  'computer-science': 'Computer Science',
  english: 'English',
  history: 'History',
  geography: 'Geography',
};

const TRIMESTERS = [
  { id: 't1', name: 'Trimester 1', lessons: 24, progress: 75 },
  { id: 't2', name: 'Trimester 2', lessons: 28, progress: 40 },
  { id: 't3', name: 'Trimester 3', lessons: 26, progress: 0 },
];

export default function ModuleDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const moduleName = MODULE_NAMES[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-72 pb-6 p-4 lg:p-6 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Back link */}
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Banner - Module name */}
          <div className="rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-primary mb-10 overflow-hidden shadow-xl">
            <div className="px-8 py-12 lg:py-16 text-center relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
              <h1 className="relative text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-white drop-shadow-md">
                {moduleName}
              </h1>
              <p className="relative mt-2 text-white/90 text-lg">
                Access your trimesters and course content
              </p>
            </div>
          </div>

          {/* My Trimesters - Cards */}
          <section>
            <h2 className="text-xl lg:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              My Trimesters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRIMESTERS.map((trimester) => (
                <div
                  key={trimester.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">
                      {trimester.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {trimester.lessons} lessons
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{trimester.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
                          style={{ width: `${trimester.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/dashboard/modules/${slug}/${trimester.id}`}
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-heading font-semibold text-sm hover:shadow-lg hover:shadow-primary/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Access</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
