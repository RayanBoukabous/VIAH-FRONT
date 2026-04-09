'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import LandingHeroInteractiveDemo from '@/components/landing/LandingHeroInteractiveDemo';
import { LANDING_DASH_MOCK } from '@/components/landing/LandingDashboardPreview';

/** Smooth, seamless vertical drift — keyframes match at 0% / 100% to avoid pops */
function floatTransition(duration: number, delay = 0) {
  return {
    duration,
    delay,
    repeat: Infinity,
    ease: [0.45, 0.05, 0.55, 0.95] as [number, number, number, number],
    times: [0, 0.5, 1] as [number, number, number],
  };
}

function HeroFloatCard({
  children,
  className,
  duration,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  duration: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`w-full will-change-transform ${className ?? ''}`}
      initial={false}
      animate={reduce ? { y: 0 } : { y: [0, -8, 0] }}
      transition={reduce ? { duration: 0 } : floatTransition(duration, delay)}
    >
      {children}
    </motion.div>
  );
}

export default function LandingHero() {
  const locale = useLocale();

  return (
    <section
      id="home"
      className="relative overflow-x-hidden px-4 pb-24 pt-32 sm:px-6 lg:px-10 lg:pb-28 lg:pt-36"
    >
      {/* Background logo — contained in section, no overflow scroll */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-full w-full max-w-[min(92vw,880px)] items-center justify-center px-2"
        >
          <Image
            src="/assets/logo/logo_viah.png"
            alt=""
            width={880}
            height={880}
            sizes="(max-width: 1024px) 92vw, 880px"
            className="h-auto w-full max-h-[min(52vh,560px)] object-contain object-center opacity-[0.07] saturate-110 contrast-105 dark:opacity-[0.14] dark:saturate-125"
            priority
          />
        </motion.div>
        <div
          className="absolute left-1/2 top-1/2 h-[min(85vw,720px)] w-[min(85vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.045] blur-3xl dark:bg-blue-500/[0.09]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-16 overflow-visible lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.04] dark:text-blue-200">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
            {locale === 'hi' ? 'AI-पावर्ड लर्निंग सिस्टम' : 'AI-powered learning system'}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl xl:text-[88px]">
            <span>{locale === 'hi' ? 'स्मार्ट सीखो।' : 'Learn Smarter.'}</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
              {locale === 'hi' ? 'तेजी से आगे बढ़ो।' : 'Grow Faster.'}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {locale === 'hi'
              ? 'VIAH छात्रों के लिए बनाया गया अगली पीढ़ी का लर्निंग प्लेटफॉर्म है। AI ट्यूटर, इंटरेक्टिव कोर्सेज और स्मार्ट प्रोग्रेस ट्रैकिंग के साथ हर दिन बेहतर सीखें।'
              : 'VIAH is the next-generation e-learning platform built for ambitious students, with AI tutoring, interactive courses, and progress systems that make every session feel smarter.'}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/${locale}/signup`}
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-7 text-base font-semibold text-white shadow-[0_18px_40px_-16px_rgba(59,130,246,0.8)] transition-all duration-300 hover:scale-[1.02]"
            >
              {locale === 'hi' ? 'अभी शुरू करें' : 'Start Learning'}
            </Link>
            <Link
              href={`/${locale}#courses`}
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 text-base font-semibold text-slate-900 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.06]"
            >
              {locale === 'hi' ? 'कोर्स देखें' : 'Explore Courses'}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              locale === 'hi' ? '50K+ छात्र' : '50K+ learners',
              locale === 'hi' ? '100+ AI-फर्स्ट कोर्स' : '100+ AI-first courses',
              locale === 'hi' ? '24/7 स्मार्ट सहायता' : '24/7 smart support',
            ].map((badge) => (
              <div key={badge} className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                {badge}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mx-auto w-full max-w-[1100px] px-1 sm:px-3"
        >
          {/* Aperçu dashboard (cliquable) à gauche — petites cartes à droite, mêmes données mock que /dashboard */}
          <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-start xl:justify-center xl:gap-6 2xl:gap-8">
            <div className="order-1 min-w-0 w-full flex-1 xl:max-w-[min(100%,500px)]">
              <LandingHeroInteractiveDemo />
            </div>

            <div className="order-2 flex w-full flex-col gap-4 sm:mx-auto sm:max-w-md xl:order-2 xl:mx-0 xl:w-[13.5rem] xl:shrink-0 xl:pt-1">
              <HeroFloatCard duration={6.2} delay={0}>
                <Link
                  href={`/${locale}/dashboard`}
                  className="block rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all hover:border-blue-300/40 hover:shadow-blue-500/10 dark:border-white/10 dark:bg-[#111827]/95 dark:hover:border-cyan-500/25"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'स्ट्रीक' : 'Streak'}
                  </p>
                  <p className="mt-2 text-3xl font-black tabular-nums text-slate-950 dark:text-white">{LANDING_DASH_MOCK.streak}</p>
                  <p className="mt-1 text-sm leading-snug text-cyan-600 dark:text-cyan-300">
                    {locale === 'hi' ? 'दिन लगातार' : 'days in a row'}
                  </p>
                </Link>
              </HeroFloatCard>
              <HeroFloatCard duration={5.8} delay={0.45}>
                <Link
                  href={`/${locale}/dashboard`}
                  className="block rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all hover:border-blue-300/40 hover:shadow-blue-500/10 dark:border-white/10 dark:bg-[#111827]/95 dark:hover:border-cyan-500/25"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'साप्ताहिक लक्ष्य' : 'Weekly goal'}
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                      style={{ width: `${LANDING_DASH_MOCK.weeklyGoal}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{LANDING_DASH_MOCK.weeklyGoal}%</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'डैशबोर्ड जैसा' : 'Same as dashboard'}
                  </p>
                </Link>
              </HeroFloatCard>
              <HeroFloatCard duration={7.4} delay={0.3}>
                <Link
                  href={`/${locale}/dashboard`}
                  className="block rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all hover:border-blue-300/40 hover:shadow-blue-500/10 dark:border-white/10 dark:bg-[#111827]/95 dark:hover:border-cyan-500/25"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'AI ट्यूटर' : 'AI Tutor'}
                  </p>
                  <p className="mt-2 text-lg font-bold leading-snug text-slate-950 dark:text-white">
                    {locale === 'hi' ? 'तुरंत मदद' : 'Instant help'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {locale === 'hi' ? 'डैशबोर्ड पर वही अनुभव।' : 'Same experience on your dashboard.'}
                  </p>
                </Link>
              </HeroFloatCard>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
