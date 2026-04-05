'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
];

export default function LanguageDropdown() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const getLocalePath = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`;
    
    // Handle default locale (en) which might not have prefix
    const currentPath = pathname.startsWith(`/${locale}`) 
      ? pathname.replace(`/${locale}`, '') 
      : pathname;
    
    // Remove leading slash if exists
    const cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
    
    // For default locale (en), don't add prefix
    if (newLocale === 'en') {
      return cleanPath === '/' ? '/' : cleanPath;
    }
    
    // For other locales, add prefix
    return `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-600/50 hover:border-primary/30 dark:hover:border-primary-light/30 transition-all duration-200 font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light min-h-[40px]"
      >
        <svg className="w-5 h-5 text-current shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline text-sm font-semibold">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={getLocalePath(lang.code)}
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary-dark/5 dark:hover:from-primary/10 dark:hover:to-primary-dark/10 transition-all duration-200 ${
                locale === lang.code
                  ? 'bg-gradient-to-r from-primary/10 to-primary-dark/10 dark:from-primary/20 dark:to-primary-dark/20 text-primary dark:text-primary-light font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light'
              }`}
            >
              <span className="flex-1 text-sm font-medium">{lang.name}</span>
              {locale === lang.code && (
                <svg className="w-5 h-5 text-primary dark:text-primary-light flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
