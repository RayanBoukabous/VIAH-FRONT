'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function LandingFinalCTA() {
  const locale = useLocale();

  return (
    <section className="px-4 py-20 sm:px-5 sm:py-24 lg:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-[min(100%,1320px)] 2xl:max-w-[1600px]">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(99,102,241,0.10),rgba(6,182,212,0.10))] p-[1px] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.14),rgba(6,182,212,0.14))]">
          <div className="relative overflow-hidden rounded-[35px] bg-white/95 px-6 py-14 text-center sm:px-10 sm:py-16 dark:bg-[#0E1526]/96">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_30%)]" />
            <div className="relative z-10 mx-auto max-w-4xl">
              <div className="mb-4 inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.04] dark:text-blue-200">
                {locale === 'hi' ? 'अगला कदम' : 'Your next step'}
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {locale === 'hi' ? 'आज से अपनी यात्रा शुरू करें' : 'Start your journey today'}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                {locale === 'hi'
                  ? 'AI, इंटरएक्टिव लर्निंग और प्रीमियम अनुभव के साथ अपने अध्ययन को नई ऊर्जा दें।'
                  : 'Give your learning a new edge with AI, interactive study flows, and a premium experience students love coming back to.'}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/signup`}
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-7 text-base font-semibold text-white shadow-[0_18px_40px_-16px_rgba(59,130,246,0.8)] transition-all duration-300 hover:scale-[1.02]"
                >
                  {locale === 'hi' ? 'मुफ्त शुरुआत करें' : 'Start free'}
                </Link>
                <Link
                  href={`/${locale}/login`}
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 text-base font-semibold text-slate-900 backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/30 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.06]"
                >
                  {locale === 'hi' ? 'साइन इन' : 'Sign in'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
