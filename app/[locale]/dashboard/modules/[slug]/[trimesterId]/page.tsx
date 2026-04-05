'use client';

import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

const TRIMESTER_NAMES: Record<string, string> = {
  t1: 'Trimester 1',
  t2: 'Trimester 2',
  t3: 'Trimester 3',
};

// Simulated courses per trimester (Mathematics T1)
const COURSES_BY_TRIMESTER: Record<string, Array<{ id: string; title: string; description: string; lessons: number; duration: string; progress: number; status: string }>> = {
  t1: [
    { id: 'c1', title: 'Algebra fundamentals', description: 'Numbers, operations, expressions and equations. Build a solid base for advanced algebra.', lessons: 6, duration: '2h 30min', progress: 100, status: 'completed' },
    { id: 'c2', title: 'Linear equations & inequalities', description: 'Solve linear equations and inequalities in one variable. Graphical representation and word problems.', lessons: 5, duration: '2h 15min', progress: 80, status: 'in_progress' },
    { id: 'c3', title: 'Introduction to geometry', description: 'Points, lines, angles and basic geometric figures. Perimeter, area and first proofs.', lessons: 6, duration: '2h 45min', progress: 33, status: 'in_progress' },
    { id: 'c4', title: 'Functions and graphs', description: 'Definition of a function, domain and range. Linear and quadratic functions, sketching graphs.', lessons: 5, duration: '2h 00min', progress: 0, status: 'not_started' },
    { id: 'c5', title: 'Polynomials and factoring', description: 'Operations on polynomials. Factoring techniques and solving polynomial equations.', lessons: 4, duration: '1h 45min', progress: 0, status: 'not_started' },
  ],
  t2: [
    { id: 'c6', title: 'Quadratic equations', description: 'Solving by factoring, completing the square and the quadratic formula. Applications.', lessons: 5, duration: '2h 20min', progress: 40, status: 'in_progress' },
    { id: 'c7', title: 'Trigonometry basics', description: 'Right triangles, sine, cosine, tangent. Unit circle and basic identities.', lessons: 6, duration: '2h 40min', progress: 0, status: 'not_started' },
    { id: 'c8', title: 'Sequences and series', description: 'Arithmetic and geometric sequences. Sums and simple applications.', lessons: 4, duration: '1h 50min', progress: 0, status: 'not_started' },
  ],
  t3: [
    { id: 'c9', title: 'Calculus introduction', description: 'Limits, continuity and introduction to derivatives.', lessons: 6, duration: '3h 00min', progress: 0, status: 'not_started' },
    { id: 'c10', title: 'Statistics and probability', description: 'Data representation, mean, median, mode. Basic probability and distributions.', lessons: 5, duration: '2h 30min', progress: 0, status: 'not_started' },
  ],
};

export default function TrimesterPage() {
  const params = useParams();
  const locale = useLocale();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const trimesterId = typeof params.trimesterId === 'string' ? params.trimesterId : '';
  const trimesterName = TRIMESTER_NAMES[trimesterId] ?? trimesterId;
  const moduleName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const courses = COURSES_BY_TRIMESTER[trimesterId] ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-72 pb-6 p-4 lg:p-6 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <Link
            href={`/${locale}/dashboard/modules/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {moduleName}
          </Link>

          {/* Header */}
          <div className="mt-8 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              {moduleName} — {trimesterName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {courses.length} courses · Complete lessons and track your progress
            </p>
          </div>

          {/* Course list */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              Courses
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          course.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : course.status === 'in_progress'
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {course.status === 'completed' ? 'Completed' : course.status === 'in_progress' ? 'In progress' : 'Not started'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white text-center font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      {course.progress === 0 ? 'Start course' : course.progress === 100 ? 'Review' : 'Continue'}
                    </button>
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
