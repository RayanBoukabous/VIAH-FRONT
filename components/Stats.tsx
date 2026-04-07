'use client';

import { useLocale } from 'next-intl';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined';
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined';
import TranslateOutlined from '@mui/icons-material/TranslateOutlined';
import PublicOutlined from '@mui/icons-material/PublicOutlined';

type StatItem = {
  value: number;
  suffix: string;
  labelEn: string;
  labelHi: string;
  icon: React.ReactNode;
  gradient: string;
};

const stats: StatItem[] = [
  {
    value: 50,
    suffix: 'K+',
    labelEn: 'Active Learners',
    labelHi: 'सक्रिय शिक्षार्थी',
    icon: <GroupsOutlined className="!w-9 !h-9 text-primary dark:text-sky-300" />,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    value: 100,
    suffix: '+',
    labelEn: 'Courses Available',
    labelHi: 'उपलब्ध पाठ्यक्रम',
    icon: <LibraryBooksOutlined className="!w-9 !h-9 text-violet-600 dark:text-violet-300" />,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    value: 98,
    suffix: '%',
    labelEn: 'Satisfaction Rate',
    labelHi: 'संतुष्टि दर',
    icon: <VerifiedOutlined className="!w-9 !h-9 text-cyan-600 dark:text-cyan-300" />,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    value: 12,
    suffix: '+',
    labelEn: 'Indian Languages',
    labelHi: 'भारतीय भाषाएं',
    icon: <TranslateOutlined className="!w-9 !h-9 text-emerald-600 dark:text-emerald-300" />,
    gradient: 'from-emerald-500 to-teal-600',
  },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { duration: 2.2, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, target, count]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(v) + suffix;
      }
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function Stats() {
  const locale = useLocale();

  return (
    <section className="relative w-full py-20 bg-transparent overflow-hidden border-t border-slate-200/70 dark:border-white/[0.06]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/35 dark:via-blue-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/35 dark:via-blue-500/40 to-transparent" />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            {locale === 'en' ? 'Trusted by thousands across India' : 'भारत भर में हजारों लोगों का भरोसा'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {locale === 'en' ? 'Numbers that speak for our impact' : 'हमारे प्रभाव की बात करते आंकड़े'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative group p-6 rounded-2xl border border-slate-200/90 dark:border-white/[0.07] bg-white/75 dark:bg-white/[0.03] backdrop-blur-md text-center overflow-hidden transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(52,150,226,0.06) 0%, transparent 70%)' }}
              />

              <div className="flex justify-center mb-3 text-slate-700 dark:text-slate-200">{stat.icon}</div>

              <div className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>

              <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                {locale === 'en' ? stat.labelEn : stat.labelHi}
              </div>

              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-2/3 transition-all duration-500 rounded-full bg-gradient-to-r ${stat.gradient}`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-6"
        >
          <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-primary/25 dark:to-blue-500/30" />
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500 text-sm font-medium">
            <PublicOutlined className="!w-5 !h-5 text-primary dark:text-sky-400" />
            <span>{locale === 'en' ? 'Covering all 28 states of India' : 'भारत के सभी 28 राज्यों में'}</span>
          </div>
          <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-primary/25 dark:to-blue-500/30" />
        </motion.div>
      </div>
    </section>
  );
}
