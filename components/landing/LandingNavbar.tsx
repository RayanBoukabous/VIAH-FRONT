'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const navKeys = [
  { id: 'home', href: '' },
  { id: 'modules', href: '#modules' },
  { id: 'courses', href: '#courses' },
  { id: 'features', href: '#features' },
  { id: 'pricing', href: '#pricing' },
];

export default function LandingNavbar() {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const label = (id: string) => {
    if (locale === 'hi') {
      if (id === 'home') return 'होम';
      if (id === 'modules') return 'मॉड्यूल';
      if (id === 'courses') return 'पाठ्यक्रम';
      if (id === 'features') return 'फीचर्स';
      return 'प्राइसिंग';
    }
    if (id === 'home') return 'Home';
    if (id === 'modules') return 'Modules';
    if (id === 'courses') return 'Courses';
    if (id === 'features') return 'Features';
    return 'Pricing';
  };

  const rootHref = `/${locale}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/72 backdrop-blur-2xl shadow-[0_18px_50px_-24px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#0B1220]/70 dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.7)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href={rootHref} className="group flex items-center gap-3">
          <div className="relative">
            <span className="absolute -inset-2 rounded-3xl bg-blue-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
              <Image
                src="/assets/logo/logo_viah.png"
                alt="VIAH"
                width={164}
                height={54}
                className="h-10 w-auto brightness-100 dark:brightness-110"
                priority
              />
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          <div className="rounded-full border border-slate-200 bg-white/80 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
            {navKeys.map((item) => (
              <Link
                key={item.id}
                href={`${rootHref}${item.href}`}
                className="group relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              >
                <span>{label(item.id)}</span>
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="rounded-full border border-slate-200 bg-white/80 px-2 py-1.5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
            <ThemeToggle />
          </div>

          <Link
            href={`/${locale}/login`}
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-slate-200 bg-white/90 px-5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-white dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.08]"
          >
            {locale === 'hi' ? 'लॉग इन' : 'Log in'}
          </Link>

          <Link
            href={`/${locale}/signup`}
            className="group relative inline-flex min-h-[46px] items-center justify-center overflow-hidden rounded-full border border-blue-400/20 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-6 text-sm font-semibold text-white shadow-[0_12px_32px_-14px_rgba(59,130,246,0.85)] transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)]" />
            <span className="relative z-10">{locale === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-900 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:text-white xl:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-nav"
        >
          <div className="relative h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all ${mobileOpen ? 'top-1.5 rotate-45' : ''}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-5 rounded-full bg-current transition-all ${mobileOpen ? 'top-1.5 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile / tablet: overlay + slide-in sidebar (drawer) */}
      <AnimatePresence mode="sync">
        {mobileOpen ? (
          <>
            <motion.button
              key="landing-nav-backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm xl:hidden"
              aria-label={locale === 'hi' ? 'मेनू बंद करें' : 'Close menu'}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="landing-nav-drawer"
              id="landing-mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label={locale === 'hi' ? 'नेविगेशन' : 'Navigation'}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(100%,20rem)] flex-col border-l border-slate-200/90 bg-white shadow-[-12px_0_40px_-12px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-[#0B1220] dark:shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.65)] xl:hidden"
            >
              <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200/80 px-4 dark:border-white/[0.08]">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {locale === 'hi' ? 'मेनू' : 'Menu'}
                </p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/12 dark:text-slate-200 dark:hover:bg-white/[0.06]"
                  aria-label={locale === 'hi' ? 'बंद करें' : 'Close'}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-4">
                {navKeys.map((item) => (
                  <Link
                    key={item.id}
                    href={`${rootHref}${item.href}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/[0.06]"
                  >
                    {label(item.id)}
                  </Link>
                ))}
              </nav>

              <div className="shrink-0 border-t border-slate-200/80 p-4 dark:border-white/[0.08]">
                <div className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-white/10">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {locale === 'hi' ? 'थीम' : 'Theme'}
                  </span>
                  <ThemeToggle />
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 dark:border-white/12 dark:bg-white/[0.04] dark:text-white"
                  >
                    {locale === 'hi' ? 'लॉग इन' : 'Log in'}
                  </Link>
                  <Link
                    href={`/${locale}/signup`}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-4 text-sm font-semibold text-white"
                  >
                    {locale === 'hi' ? 'शुरू करें' : 'Get Started'}
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
