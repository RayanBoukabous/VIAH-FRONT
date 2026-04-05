'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

// Simulated enrolled courses for Rayan Boukabous
const MY_COURSES = [
  { id: 'math', title: 'Mathematics', module: 'mathematics', lessons: 24, completed: 18, progress: 75, status: 'in_progress' },
  { id: 'physics', title: 'Physics', module: 'physics', lessons: 20, completed: 8, progress: 40, status: 'in_progress' },
  { id: 'chemistry', title: 'Chemistry', module: 'chemistry', lessons: 18, completed: 18, progress: 100, status: 'completed' },
  { id: 'algebra', title: 'Algebra & Functions', module: 'mathematics', lessons: 16, completed: 12, progress: 75, status: 'in_progress' },
  { id: 'geometry', title: 'Geometry', module: 'mathematics', lessons: 14, completed: 2, progress: 14, status: 'in_progress' },
  { id: 'mechanics', title: 'Mechanics', module: 'physics', lessons: 12, completed: 0, progress: 0, status: 'not_started' },
];

export default function MyCoursesPage() {
  const locale = useLocale();

  const enrolled = MY_COURSES.length;
  const inProgress = MY_COURSES.filter((c) => c.status === 'in_progress').length;
  const completed = MY_COURSES.filter((c) => c.status === 'completed').length;

  const stats = [
    { label: 'Enrolled', value: enrolled, color: 'from-primary to-primary-dark' },
    { label: 'In progress', value: inProgress, color: 'from-primary-dark to-primary' },
    { label: 'Completed', value: completed, color: 'from-primary to-primary-dark' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />

      <main className="ml-64 pt-72 pb-6 p-4 lg:p-6 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 pt-20">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your enrolled courses and progress
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-5 text-white`}
              >
                <p className="text-sm font-medium opacity-90 uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Course cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              All courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MY_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {course.completed}/{course.lessons} lessons
                        </p>
                      </div>
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
                    <Link
                      href={`/${locale}/dashboard/modules/${course.module}`}
                      className="block w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white text-center font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      Open course
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
