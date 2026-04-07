'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import PublicOutlined from '@mui/icons-material/PublicOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const links = [
    { key: 'about', href: '/about' },
    { key: 'courses', href: '/courses' },
    { key: 'contact', href: '/contact' },
  ];

  const legal = [
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-slate-100 dark:bg-[#020817] border-t border-slate-200/90 dark:border-white/[0.07]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/40 to-transparent" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(800px,100%)] h-[280px] bg-blue-400/5 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <Link href={`/${locale}`} className="inline-block mb-5">
              <Image
                src="/assets/logo/logo_viah.png"
                alt="VIAH"
                width={140}
                height={48}
                className="h-10 w-auto dark:brightness-110"
              />
            </Link>
            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t('description')}
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: 'Facebook',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: 'Twitter/X',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-300 hover:border-primary/30 dark:hover:border-blue-400/40 flex items-center justify-center transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-5 uppercase tracking-widest">
              {locale === 'en' ? 'Platform' : 'प्लेटफॉर्म'}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-300 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary dark:bg-blue-400 transition-all duration-300" />
                    {t(`links.${link.key as 'about' | 'courses' | 'contact'}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-5 uppercase tracking-widest">
              {locale === 'en' ? 'Legal' : 'कानूनी'}
            </h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-300 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary dark:bg-blue-400 transition-all duration-300" />
                    {t(`links.${link.key as 'privacy' | 'terms'}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-5 uppercase tracking-widest">
              {locale === 'en' ? 'Built for' : 'किसके लिए'}
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm">
                <PublicOutlined className="!w-[18px] !h-[18px] text-primary dark:text-sky-400" />
                <span className="font-medium">{locale === 'en' ? 'India' : 'भारत'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm">
                <SchoolOutlined className="!w-[18px] !h-[18px] text-primary dark:text-sky-400" />
                <span>{locale === 'en' ? 'K–12 students' : 'K–12 छात्र'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm">
                <SmartToyOutlined className="!w-[18px] !h-[18px] text-primary dark:text-sky-400" />
                <span>{locale === 'en' ? 'AI-first' : 'AI-फर्स्ट'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/90 dark:border-white/[0.07] pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-gray-500 text-sm">{t('copyright')}</p>
          <div className="flex items-center gap-2 text-slate-500 dark:text-gray-500 text-sm">
            <span>{locale === 'en' ? 'Made with' : 'बनाया गया'}</span>
            <FavoriteOutlined className="!w-4 !h-4 text-rose-500 dark:text-rose-400" />
            <span>{locale === 'en' ? 'for India' : 'भारत के लिए'}</span>
            <PublicOutlined className="!w-4 !h-4 text-primary/80 dark:text-sky-400/90" />
          </div>
        </div>
      </div>
    </footer>
  );
}
