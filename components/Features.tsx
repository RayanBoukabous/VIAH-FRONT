'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const featureIcons = {
  curriculum: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  videos: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  quizzes: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  chatbot: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  dashboard: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  personalized: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

export default function Features() {
  const t = useTranslations('features');
  const locale = useLocale();

  const features = [
    'curriculum',
    'videos',
    'quizzes',
    'chatbot',
    'dashboard',
    'personalized',
  ] as const;

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature}
              className="group p-8 rounded-2xl bg-gradient-to-br from-white to-primary-light/5 dark:from-gray-800 dark:to-primary-dark/10 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 text-primary dark:text-primary-light group-hover:scale-110 transition-transform">
                {featureIcons[feature]}
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                {t(`items.${feature}.title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(`items.${feature}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-primary rounded-2xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {locale === 'en' 
              ? 'Ready to Transform Your Learning?' 
              : 'अपने सीखने को बदलने के लिए तैयार हैं?'}
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {locale === 'en'
              ? 'Join thousands of students already learning smarter with VIAH'
              : 'VIAH के साथ स्मार्ट सीखने वाले हजारों छात्रों में शामिल हों'}
          </p>
          <button className="px-8 py-4 bg-white dark:bg-gray-800 text-primary dark:text-primary-light rounded-lg font-heading font-semibold text-lg hover:bg-primary-light dark:hover:bg-gray-700 transform hover:scale-105 transition-all shadow-lg">
            {locale === 'en' ? 'Get Started Free' : 'मुफ्त में शुरू करें'}
          </button>
        </div>
      </div>
    </section>
  );
}
