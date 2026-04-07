'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import PlayCircleOutlined from '@mui/icons-material/PlayCircleOutlined';
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import PsychologyOutlined from '@mui/icons-material/PsychologyOutlined';

type FeatureKey = 'curriculum' | 'videos' | 'quizzes' | 'chatbot' | 'dashboard' | 'personalized';

const featureConfig: Record<FeatureKey, { gradient: string; glow: string; icon: React.ReactNode }> = {
  curriculum: {
    gradient: 'from-blue-500 to-blue-700',
    glow: 'rgba(59,130,246,0.25)',
    icon: <MenuBookOutlined className="!w-8 !h-8" />,
  },
  videos: {
    gradient: 'from-violet-500 to-purple-700',
    glow: 'rgba(139,92,246,0.25)',
    icon: <PlayCircleOutlined className="!w-8 !h-8" />,
  },
  quizzes: {
    gradient: 'from-emerald-500 to-teal-700',
    glow: 'rgba(16,185,129,0.25)',
    icon: <FactCheckOutlined className="!w-8 !h-8" />,
  },
  chatbot: {
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.25)',
    icon: <SmartToyOutlined className="!w-8 !h-8" />,
  },
  dashboard: {
    gradient: 'from-orange-500 to-rose-600',
    glow: 'rgba(249,115,22,0.25)',
    icon: <InsightsOutlined className="!w-8 !h-8" />,
  },
  personalized: {
    gradient: 'from-pink-500 to-rose-700',
    glow: 'rgba(236,72,153,0.25)',
    icon: <PsychologyOutlined className="!w-8 !h-8" />,
  },
};

const features: FeatureKey[] = ['curriculum', 'videos', 'quizzes', 'chatbot', 'dashboard', 'personalized'];

export default function Features() {
  const t = useTranslations('features');
  const locale = useLocale();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section className="relative w-full py-24 bg-transparent overflow-hidden border-t border-slate-200/70 dark:border-white/[0.06]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,90vw)] h-[min(900px,90vw)] bg-blue-400/5 dark:bg-blue-900/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/25 dark:border-blue-400/30 bg-white/70 dark:bg-blue-400/10 text-primary-dark dark:text-blue-300 text-sm font-semibold mb-5 shadow-sm dark:shadow-none">
            {locale === 'en' ? 'Platform features' : 'प्लेटफॉर्म फीचर्स'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5">
            {t('title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/60 dark:to-blue-500" />
            <div className="w-2 h-2 rounded-full bg-primary dark:bg-blue-400" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/60 dark:to-blue-500" />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const config = featureConfig[feature];
            return (
              <motion.div
                key={feature}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-7 rounded-2xl border border-slate-200/90 dark:border-white/[0.07] bg-white/75 dark:bg-white/[0.03] backdrop-blur-md overflow-hidden cursor-default transition-all duration-300 shadow-sm dark:shadow-none"
                style={{ '--glow': config.glow } as React.CSSProperties}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ boxShadow: `inset 0 0 60px ${config.glow}, 0 0 40px ${config.glow}` }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 dark:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div
                  className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {config.icon}
                </div>

                <h3 className="relative z-10 text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-blue-100 transition-colors">
                  {t(`items.${feature}.title`)}
                </h3>
                <p className="relative z-10 text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {t(`items.${feature}.description`)}
                </p>

                <div className="relative z-10 mt-5 flex items-center gap-1 text-primary/0 group-hover:text-primary dark:group-hover:text-blue-400 transition-all duration-300 text-sm font-semibold">
                  <span>{locale === 'en' ? 'Learn more' : 'और जानें'}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
