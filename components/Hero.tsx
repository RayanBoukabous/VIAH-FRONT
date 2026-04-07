'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SmartToy from '@mui/icons-material/SmartToy';
import Public from '@mui/icons-material/Public';
import StarRounded from '@mui/icons-material/StarRounded';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  const stats = [
    { value: '50K+', label: locale === 'en' ? 'Learners' : 'शिक्षार्थी' },
    { value: '100+', label: locale === 'en' ? 'Courses' : 'पाठ्यक्रम' },
    { value: '98%', label: locale === 'en' ? 'Satisfaction' : 'संतुष्टि' },
    { value: '24/7', label: locale === 'en' ? 'AI Support' : 'AI सहायता' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-[76px] bg-transparent">
      {/* Soft ambient (theme-aware) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-[15%] w-[min(90vw,700px)] h-[min(90vw,700px)] bg-sky-300/25 dark:bg-blue-700/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[min(85vw,600px)] h-[min(85vw,600px)] bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-200/20 dark:bg-cyan-500/8 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 dark:border-blue-400/30 bg-white/70 dark:bg-blue-400/10 backdrop-blur-md text-primary-dark dark:text-blue-300 text-sm font-semibold shadow-sm dark:shadow-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {locale === 'en' ? "India's #1 AI learning platform" : 'भारत का #1 AI लर्निंग प्लेटफॉर्म'}
              </span>
            </motion.div>

            <motion.div variants={item}>
              <h1 className="leading-[1.05]">
                <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#0f3d73] via-[#3496E2] to-[#0ea5e9] dark:from-white dark:via-blue-100 dark:to-blue-300">
                  VIAH
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white/90 mt-2">
                  {locale === 'en' ? 'Learn Smarter.' : 'स्मार्ट सीखें।'}
                </span>
                <span className="block text-lg sm:text-xl md:text-2xl font-semibold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  {locale === 'en' ? 'Powered by Artificial Intelligence' : 'आर्टिफिशियल इंटेलिजेंस द्वारा संचालित'}
                </span>
              </h1>
            </motion.div>

            <motion.p variants={item} className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
              {t('description')}
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/login`}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #3496E2, #164780)' }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#98D8F3] to-[#3496E2]" />
                <span className="relative z-10">{t('cta')}</span>
                <ArrowForward className="relative z-10 !w-5 !h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/login`}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg text-primary dark:text-cyan-300 border-2 border-primary/25 dark:border-blue-400/40 bg-white/80 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] shadow-sm"
              >
                <ExploreOutlined className="!w-5 !h-5" />
                {t('ctaSecondary')}
              </Link>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/80 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-sm shadow-sm dark:shadow-none hover:border-primary/30 dark:hover:border-blue-400/30 transition-colors"
                >
                  <span className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-cyan-600 dark:from-blue-300 dark:to-cyan-300 tabular-nums">
                    {s.value}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5 text-center">{s.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-4 pt-1">
              <div className="flex -space-x-2">
                {['A', 'P', 'R', 'S', 'M'].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-[#020617] flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, hsl(${210 + i * 15},70%,${42 + i * 4}%), hsl(${220 + i * 15},75%,34%))`,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="text-slate-900 dark:text-white font-semibold">50,000+</span>{' '}
                {locale === 'en' ? 'students already learning' : 'छात्र पहले से सीख रहे हैं'}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex items-center justify-center min-h-[400px] lg:min-h-[520px]"
          >
            <div className="absolute w-[min(100vw,480px)] h-[min(100vw,480px)] rounded-full border border-primary/10 dark:border-blue-500/10 animate-spin-slow" style={{ animationDuration: '32s' }} />
            <div className="absolute w-[min(88vw,420px)] h-[min(88vw,420px)] rounded-full border border-sky-300/40 dark:border-blue-400/15 animate-spin-slow-reverse" style={{ animationDuration: '24s' }} />
            <div className="absolute w-[min(76vw,360px)] h-[min(76vw,360px)] rounded-full border border-cyan-300/30 dark:border-blue-300/20 animate-spin-slow" style={{ animationDuration: '18s' }} />
            <div className="absolute w-[min(64vw,300px)] h-[min(64vw,300px)] rounded-full border-2 border-primary/20 dark:border-blue-500/25 animate-pulse-ring" />

            <div className="absolute w-[min(55vw,280px)] h-[min(55vw,280px)] rounded-full bg-gradient-to-br from-sky-200/50 to-blue-300/30 dark:bg-blue-600/15 blur-[56px]" />

            <div className="relative z-10">
              <Image
                src="/assets/logo/logo_hero.png"
                alt="VIAH Logo"
                width={340}
                height={340}
                className="w-auto h-auto max-w-[min(300px,85vw)] drop-shadow-xl dark:drop-shadow-[0_0_50px_rgba(52,150,226,0.45)]"
                priority
              />
            </div>

            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 -right-2 lg:right-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-blue-400/25 shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg">
                <SmartToy sx={{ fontSize: 22 }} />
              </div>
              <div>
                <div className="text-slate-900 dark:text-white text-xs font-bold">AI</div>
                <div className="text-slate-500 dark:text-blue-300 text-[10px] font-medium">Smart learning</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-14 -left-2 lg:left-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-blue-400/25 shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-orange-500 dark:to-orange-700 flex items-center justify-center text-white shadow-lg">
                <Public sx={{ fontSize: 22 }} />
              </div>
              <div>
                <div className="text-slate-900 dark:text-white text-xs font-bold">India</div>
                <div className="text-slate-500 dark:text-blue-300 text-[10px] font-medium">Hindi & English</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-6, 10, -6] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-12 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-cyan-400/25 shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg">
                <StarRounded sx={{ fontSize: 24 }} />
              </div>
              <div>
                <div className="text-slate-900 dark:text-white text-xs font-bold">98%</div>
                <div className="text-slate-500 dark:text-cyan-300 text-[10px] font-medium">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-blue-400/70">
          {locale === 'en' ? 'Scroll' : 'स्क्रॉल'}
        </span>
        <div className="w-5 h-8 rounded-full border border-slate-300/90 dark:border-blue-400/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-1.5 rounded-full bg-primary dark:bg-blue-400 animate-scroll-indicator" />
        </div>
      </motion.div>
    </section>
  );
}
