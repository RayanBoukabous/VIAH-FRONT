'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  // Mock data - à remplacer par des données réelles
  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    studyYear: '2ème année',
    specialty: 'Informatique',
    studyTimeToday: '2h 30min',
    enrolledCourses: 12,
    completedLessons: 45,
    totalLessons: 120,
    progress: 37.5,
  };

  const stats = [
    {
      title: locale === 'en' ? 'Study Time Today' : 'आज का अध्ययन समय',
      value: studentData.studyTimeToday,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark',
    },
    {
      title: locale === 'en' ? 'Enrolled Courses' : 'नामांकित पाठ्यक्रम',
      value: `${studentData.enrolledCourses}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-primary-dark to-primary',
    },
    {
      title: locale === 'en' ? 'Completed Lessons' : 'पूर्ण पाठ',
      value: `${studentData.completedLessons}/${studentData.totalLessons}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-primary-dark to-primary',
    },
    {
      title: locale === 'en' ? 'Overall Progress' : 'कुल प्रगति',
      value: `${studentData.progress}%`,
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
          {/* Welcome Section */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 pt-20">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3 block leading-tight">
              {locale === 'en' ? 'Welcome back,' : 'वापसी पर स्वागत है,'} {studentData.firstName} {studentData.lastName}!
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {locale === 'en' 
                ? `Here's your learning overview for today` 
                : `यहां आज के लिए आपका सीखने का अवलोकन है`}
            </p>
          </div>

          {/* Student Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
                  {studentData.firstName[0]}{studentData.lastName[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-heading font-bold text-gray-900 dark:text-white truncate">
                    {studentData.firstName} {studentData.lastName}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {locale === 'en' ? 'Student' : 'छात्र'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {locale === 'en' ? 'Study Year' : 'अध्ययन वर्ष'}
                </p>
                <p className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  {studentData.studyYear}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {locale === 'en' ? 'Specialty' : 'विशेषज्ञता'}
                </p>
                <p className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  {studentData.specialty}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
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
                {locale === 'en' ? 'My Modules' : 'मेरे मॉड्यूल'}
              </h2>
              <button className="text-xs font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                {locale === 'en' ? 'View All' : 'सभी देखें'} →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                {
                  id: 1,
                  title: locale === 'en' ? 'Mathematics' : 'गणित',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
                },
                {
                  id: 2,
                  title: locale === 'en' ? 'Physics' : 'भौतिकी',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103634.png',
                },
                {
                  id: 3,
                  title: locale === 'en' ? 'Chemistry' : 'रसायन विज्ञान',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103635.png',
                },
                {
                  id: 4,
                  title: locale === 'en' ? 'Biology' : 'जीव विज्ञान',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103636.png',
                },
                {
                  id: 5,
                  title: locale === 'en' ? 'Computer Science' : 'कंप्यूटर विज्ञान',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103637.png',
                },
                {
                  id: 6,
                  title: locale === 'en' ? 'English' : 'अंग्रेजी',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103638.png',
                },
                {
                  id: 7,
                  title: locale === 'en' ? 'History' : 'इतिहास',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103639.png',
                },
                {
                  id: 8,
                  title: locale === 'en' ? 'Geography' : 'भूगोल',
                  icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103640.png',
                },
              ].map((module) => (
                <div
                  key={module.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  {/* Icon Section with Neutral Background */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-6 flex items-center justify-center relative overflow-hidden">
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={module.icon}
                        alt={module.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                      {module.title}
                    </h3>
                    
                    {/* Access Button */}
                    <button className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-heading font-semibold text-sm hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                      <span>{locale === 'en' ? 'Access' : 'पहुंचें'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
