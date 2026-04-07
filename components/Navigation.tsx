'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageDropdown from './LanguageDropdown';

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[box-shadow,background-color,border-color] duration-300 ${
        scrolled
          ? 'bg-white/92 dark:bg-slate-950/92 backdrop-blur-xl border-b border-slate-200/95 dark:border-white/[0.09] shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)]'
          : 'bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg border-b border-slate-200/60 dark:border-white/[0.06]'
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <div className="flex justify-between items-center h-[72px] lg:h-[76px]">
          <Link href={`/${locale}`} className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/25 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
              <Image
                src="/assets/logo/logo_viah.png"
                alt="VIAH"
                width={176}
                height={56}
                className="relative h-11 lg:h-12 w-auto dark:brightness-110 group-hover:scale-[1.02] transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] shadow-inner">
              {navItems.map((item) => {
                const isActive =
                  pathname === `/${locale}${item.href}` ||
                  (item.href === '/' && pathname === `/${locale}`);
                return (
                  <Link
                    key={item.key}
                    href={`/${locale}${item.href}`}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-md shadow-primary/25'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark dark:from-blue-500 dark:to-cyan-600" />
                    )}
                    <span className="relative z-10">{t(item.key)}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] px-2 py-1.5 shadow-sm">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark dark:from-blue-500 dark:to-cyan-600 hover:brightness-105 dark:hover:brightness-110 shadow-lg shadow-primary/25 dark:shadow-cyan-900/30 border border-white/10 transition-all active:scale-[0.98]"
            >
              {t('login')}
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.04] px-1.5 py-1">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-white/[0.1] bg-white/90 dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Menu"
            >
              <div className="w-5 h-5 relative">
                <span
                  className={`absolute left-0 top-1 w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'top-2.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'top-2.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? 'max-h-[320px] opacity-100 border-t border-slate-200/80 dark:border-white/[0.08]' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === `/${locale}${item.href}` ||
                (item.href === '/' && pathname === `/${locale}`);
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary/15 text-primary dark:text-cyan-300 dark:bg-cyan-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <Link
              href={`/${locale}/login`}
              className="block mt-3 text-center px-4 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary-dark dark:from-blue-500 dark:to-cyan-600 shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
