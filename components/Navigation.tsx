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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-gradient-to-r from-primary-light/95 via-primary/95 to-primary-dark/95 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/95 backdrop-blur-xl shadow-lg border-b border-primary/20 dark:border-gray-700/50' 
        : 'bg-gradient-to-r from-primary-light/80 via-primary/80 to-primary-dark/80 dark:from-gray-900/80 dark:via-gray-900/80 dark:to-gray-900/80 backdrop-blur-lg border-b border-transparent'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section - larger for premium presence */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-xl blur-lg opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Image
                  src="/assets/logo/logo_viah.png"
                  alt="VIAH Logo"
                  width={180}
                  height={64}
                  className="h-14 w-auto dark:brightness-110 group-hover:scale-[1.02] transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}` || (item.href === '/' && pathname === `/${locale}`);
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white dark:text-white'
                      : 'text-white/90 dark:text-gray-300 hover:text-white dark:hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{t(item.key)}</span>
                  {isActive && (
                    <span className="absolute inset-0 bg-white/20 dark:bg-white/20 rounded-lg backdrop-blur-sm"></span>
                  )}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  } origin-center`}></span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions - premium order: settings group then primary CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2 py-1.5 pl-2 pr-1.5 rounded-xl bg-white/10 dark:bg-black/20 border border-white/10 dark:border-white/5">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
            <Link
              href={`/${locale}/login`}
              className="px-6 py-3 bg-white text-primary dark:bg-white dark:text-primary-dark rounded-xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-100 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 border border-white/50 dark:border-gray-600/50 min-h-[44px] inline-flex items-center justify-center"
            >
              {t('login')}
            </Link>
          </div>

          {/* Mobile: same premium group + menu */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-white/10 dark:bg-black/20 border border-white/10 py-1.5 px-2">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute top-0 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 top-2.5' : ''
                }`}></span>
                <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 top-2.5' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 space-y-2 border-t border-white/20 dark:border-gray-700 mt-2">
            {navItems.map((item, index) => {
              const isActive = pathname === `/${locale}${item.href}` || (item.href === '/' && pathname === `/${locale}`);
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-white/20 dark:bg-white/20 text-white dark:text-white font-semibold backdrop-blur-sm'
                      : 'text-white/90 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-white dark:hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <Link
              href={`/${locale}/login`}
              className="block mt-4 px-4 py-3.5 rounded-xl bg-white text-primary dark:bg-white dark:text-primary-dark font-semibold text-center hover:bg-gray-50 dark:hover:bg-gray-100 transition-all duration-200 border border-white/30"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
