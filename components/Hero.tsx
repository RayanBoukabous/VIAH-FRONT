'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-white dark:bg-gray-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 via-primary/10 to-primary-dark/20 dark:from-primary-dark/30 dark:via-primary/20 dark:to-primary-light/20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary-dark/10 dark:bg-primary-dark/20 rounded-full blur-3xl animate-float-slow delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary/20 dark:border-primary/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {locale === 'en' ? 'AI-Powered Learning Platform' : 'AI-संचालित लर्निंग प्लेटफॉर्म'}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-tight">
              <span className="block bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent animate-gradient-text mb-4">
                VIAH
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mt-2">
                {locale === 'en' ? "India's AI Learning Platform" : "भारत का AI लर्निंग प्लेटफॉर्म"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-200">
              {t('subtitle')}
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {t('description')}
            </p>

            {/* Progress Bar Section */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {locale === 'en' ? 'Platform Progress' : 'प्लेटफॉर्म प्रगति'}
                </span>
                <span className="text-sm font-bold text-primary dark:text-primary-light">{progress}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span>{locale === 'en' ? 'Active Learners' : 'सक्रिय शिक्षार्थी'}: <strong className="text-primary dark:text-primary-light">50K+</strong></span>
                <span>{locale === 'en' ? 'Courses' : 'पाठ्यक्रम'}: <strong className="text-primary dark:text-primary-light">100+</strong></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={`/${locale}/courses`}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-heading font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('cta')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            <Link
              href={`/${locale}/courses`}
              className="group relative px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-primary dark:text-primary-light border-2 border-primary dark:border-primary-light rounded-xl font-heading font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-primary/20 dark:from-primary-dark/30 dark:to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('ctaSecondary')}
              </span>
            </Link>
            </div>
          </div>

          {/* Right Column - Logo */}
          <div className="relative h-[600px] lg:h-[700px] animate-fade-in-up delay-300 flex items-center justify-center">
            <div 
              className="relative z-10 flex items-center justify-center transition-transform duration-100"
              style={{
                transform: typeof window !== 'undefined' 
                  ? `rotateY(${(mousePosition.x / window.innerWidth - 0.5) * 5}deg) rotateX(${(mousePosition.y / window.innerHeight - 0.5) * 5}deg)`
                  : 'none'
              }}
            >
              <Image
                src="/assets/logo/logo_hero.png"
                alt="VIAH Logo"
                width={400}
                height={400}
                className="w-auto h-auto max-w-[400px] max-h-[400px] dark:brightness-110 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="flex flex-col items-center gap-2 text-primary dark:text-primary-light">
          <span className="text-sm font-semibold mb-2 dark:text-gray-300">{locale === 'en' ? 'Scroll' : 'स्क्रॉल करें'}</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 dark:border-primary-light/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-light animate-scroll-indicator"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
