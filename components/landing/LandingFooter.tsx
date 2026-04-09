'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export default function LandingFooter() {
  const locale = useLocale();

  const links = [
    { href: '', labelEn: 'Home', labelHi: 'होम' },
    { href: '#courses', labelEn: 'Courses', labelHi: 'पाठ्यक्रम' },
    { href: '#features', labelEn: 'Features', labelHi: 'फीचर्स' },
    { href: '#pricing', labelEn: 'Pricing', labelHi: 'प्राइसिंग' },
  ];

  return (
    <footer className="border-t border-slate-200 px-4 pb-10 pt-16 dark:border-white/8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex rounded-[26px] border border-slate-200 bg-white/80 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <Image
              src="/assets/logo/logo_viah.png"
              alt="VIAH"
              width={160}
              height={54}
              className="h-10 w-auto brightness-110"
            />
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
            {locale === 'hi'
              ? 'भारत के छात्रों के लिए बनाया गया अगली पीढ़ी का AI लर्निंग प्लेटफॉर्म।'
              : 'The next-generation AI learning platform designed to help students move with more confidence, clarity, and momentum.'}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {locale === 'hi' ? 'नेविगेशन' : 'Navigation'}
            </p>
            <div className="space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href || 'root'}
                  href={`/${locale}${link.href}`}
                  className="block text-sm text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  {locale === 'hi' ? link.labelHi : link.labelEn}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {locale === 'hi' ? 'सोशल' : 'Social'}
            </p>
            <div className="flex gap-3">
              {['X', 'IG', 'YT'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-sm font-semibold text-slate-700 backdrop-blur-xl transition-colors hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-white/8 sm:flex-row">
        <p>© 2026 VIAH. {locale === 'hi' ? 'सभी अधिकार सुरक्षित।' : 'All rights reserved.'}</p>
        <p>{locale === 'hi' ? 'भारत के छात्रों के लिए डिज़ाइन किया गया।' : 'Designed for ambitious students across India.'}</p>
      </div>
    </footer>
  );
}
