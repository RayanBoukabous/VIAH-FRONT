'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function ModulesPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  const modules = [
    {
      id: 1,
      title: locale === 'en' ? 'Mathematics' : 'गणित',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
      description: locale === 'en' 
        ? 'Algebra, Geometry, Calculus, Statistics' 
        : 'बीजगणित, ज्यामिति, कैलकुलस, सांख्यिकी',
      courses: 12,
      lessons: 145,
    },
    {
      id: 2,
      title: locale === 'en' ? 'Physics' : 'भौतिकी',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103634.png',
      description: locale === 'en' 
        ? 'Mechanics, Thermodynamics, Optics, Electromagnetism' 
        : 'यांत्रिकी, ऊष्मप्रवैगिकी, प्रकाशिकी, विद्युत चुंबकत्व',
      courses: 10,
      lessons: 128,
    },
    {
      id: 3,
      title: locale === 'en' ? 'Chemistry' : 'रसायन विज्ञान',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103635.png',
      description: locale === 'en' 
        ? 'Organic, Inorganic, Physical, Analytical Chemistry' 
        : 'कार्बनिक, अकार्बनिक, भौतिक, विश्लेषणात्मक रसायन विज्ञान',
      courses: 9,
      lessons: 112,
    },
    {
      id: 4,
      title: locale === 'en' ? 'Biology' : 'जीव विज्ञान',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103636.png',
      description: locale === 'en' 
        ? 'Cell Biology, Genetics, Ecology, Human Anatomy' 
        : 'कोशिका जीव विज्ञान, आनुवंशिकी, पारिस्थितिकी, मानव शरीर रचना',
      courses: 11,
      lessons: 138,
    },
    {
      id: 5,
      title: locale === 'en' ? 'Computer Science' : 'कंप्यूटर विज्ञान',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103637.png',
      description: locale === 'en' 
        ? 'Programming, Data Structures, Algorithms, Databases' 
        : 'प्रोग्रामिंग, डेटा संरचनाएं, एल्गोरिदम, डेटाबेस',
      courses: 14,
      lessons: 167,
    },
    {
      id: 6,
      title: locale === 'en' ? 'English' : 'अंग्रेजी',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103638.png',
      description: locale === 'en' 
        ? 'Literature, Grammar, Composition, Communication' 
        : 'साहित्य, व्याकरण, रचना, संचार',
      courses: 8,
      lessons: 95,
    },
    {
      id: 7,
      title: locale === 'en' ? 'History' : 'इतिहास',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103639.png',
      description: locale === 'en' 
        ? 'World History, Indian History, Ancient Civilizations' 
        : 'विश्व इतिहास, भारतीय इतिहास, प्राचीन सभ्यताएं',
      courses: 7,
      lessons: 89,
    },
    {
      id: 8,
      title: locale === 'en' ? 'Geography' : 'भूगोल',
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103640.png',
      description: locale === 'en' 
        ? 'Physical Geography, Human Geography, Maps, Climate' 
        : 'भौतिक भूगोल, मानव भूगोल, मानचित्र, जलवायु',
      courses: 6,
      lessons: 76,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />
      
      <main className="ml-64 pt-60 pb-6 p-4 lg:p-6 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 pt-12">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              {locale === 'en' ? 'My Modules' : 'मेरे मॉड्यूल'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'en' 
                ? 'Explore all available study modules and subjects' 
                : 'सभी उपलब्ध अध्ययन मॉड्यूल और विषयों का अन्वेषण करें'}
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 flex flex-col h-full"
                style={{ minHeight: '420px' }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col flex-1">
                  {/* Icon Section */}
                  <div className="mb-5 flex items-center justify-center flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                      <div className="relative bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Image
                          src={module.icon}
                          alt={module.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300 flex-shrink-0 min-h-[3rem] flex items-center justify-center">
                    {module.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-5 line-clamp-2 flex-shrink-0 min-h-[2.5rem]">
                    {module.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {module.courses}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {locale === 'en' ? 'Courses' : 'पाठ्यक्रम'}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {module.lessons}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {locale === 'en' ? 'Lessons' : 'पाठ'}
                      </div>
                    </div>
                  </div>

                  {/* Access Button */}
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-heading font-semibold text-sm hover:shadow-xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden flex-shrink-0 mt-auto">
                    <span className="relative z-10">{locale === 'en' ? 'Access Module' : 'मॉड्यूल तक पहुंचें'}</span>
                    <svg className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary-dark/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
