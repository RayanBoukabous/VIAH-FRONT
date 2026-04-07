'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RocketLaunchOutlined from '@mui/icons-material/RocketLaunchOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LoginOutlined from '@mui/icons-material/LoginOutlined';

export default function CTASection() {
  const locale = useLocale();
  const t = useTranslations('hero');

  return (
    <section className="relative w-full py-24 overflow-hidden border-t border-slate-200/80 dark:border-white/[0.06] bg-gradient-to-br from-sky-50 via-white to-slate-100 dark:from-[#0c1929] dark:via-[#0a1628] dark:to-[#020617]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-cyan-500/[0.05] dark:from-blue-500/10 dark:to-cyan-500/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 dark:border-cyan-500/30 bg-white/90 dark:bg-white/[0.06] text-primary-dark dark:text-cyan-200 text-sm font-semibold mb-8 shadow-sm"
        >
          <RocketLaunchOutlined className="!w-[18px] !h-[18px]" />
          {locale === 'en' ? 'Start free — full access' : 'मुफ्त शुरू — पूर्ण एक्सेस'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl mx-auto"
        >
          {locale === 'en' ? (
            <>
              Ready to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-600 to-primary-dark dark:from-blue-400 dark:via-cyan-300 dark:to-blue-300">
                transform
              </span>
              <br />
              your learning journey?
            </>
          ) : (
            <>
              अपनी{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-600 to-primary-dark dark:from-blue-400 dark:via-cyan-300 dark:to-blue-300">
                सीखने की यात्रा
              </span>
              <br />
              बदलने के लिए तैयार हैं?
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-slate-600 dark:text-slate-400 text-xl mb-10 max-w-2xl mx-auto"
        >
          {locale === 'en'
            ? 'Join 50,000+ students already experiencing the future of education. Start free — no credit card required.'
            : '50,000+ छात्रों के साथ जुड़ें जो पहले से शिक्षा का भविष्य अनुभव कर रहे हैं। मुफ्त में शुरू करें — क्रेडिट कार्ड की जरूरत नहीं।'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={`/${locale}/courses`}
            className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-transform duration-300 hover:scale-[1.03] shadow-lg shadow-primary/25 dark:shadow-blue-900/40"
            style={{ background: 'linear-gradient(135deg, #3496E2 0%, #164780 100%)' }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#98D8F3] to-[#3496E2]" />
            <span className="relative z-10">{t('cta')}</span>
            <ArrowForward className="relative z-10 !w-5 !h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href={`/${locale}/login`}
            className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg text-primary dark:text-cyan-300 border-2 border-primary/25 dark:border-cyan-500/35 bg-white/90 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02]"
          >
            <LoginOutlined className="!w-5 !h-5" />
            {locale === 'en' ? 'Sign in' : 'साइन इन'}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-500"
        >
          {[
            { textEn: 'Free to start', textHi: 'मुफ्त शुरुआत' },
            { textEn: 'No credit card', textHi: 'कार्ड नहीं' },
            { textEn: 'Cancel anytime', textHi: 'कभी रद्द करें' },
            { textEn: 'Hindi + English', textHi: 'हिंदी + अंग्रेजी' },
          ].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <CheckCircleOutline className="!w-[18px] !h-[18px] text-emerald-600 dark:text-emerald-300/90" />
              <span>{locale === 'en' ? item.textEn : item.textHi}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
