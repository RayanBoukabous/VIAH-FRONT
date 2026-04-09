'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const modules = [
  {
    titleEn: 'STEM Foundations',
    titleHi: 'STEM आधार',
    terms: 3,
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format&fit=crop',
  },
  {
    titleEn: 'Language & Literature',
    titleHi: 'भाषा और साहित्य',
    terms: 4,
    image:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80&auto=format&fit=crop',
  },
  {
    titleEn: 'Social Sciences',
    titleHi: 'सामाजिक विज्ञान',
    terms: 3,
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80&auto=format&fit=crop',
  },
  {
    titleEn: 'Arts & Creativity',
    titleHi: 'कला और रचनात्मकता',
    terms: 2,
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop',
  },
];

export default function LandingModulesShowcase() {
  const locale = useLocale();

  return (
    <section id="modules" className="px-4 py-24 sm:px-6 lg:px-10 scroll-mt-24">
      <div className="mx-auto w-full max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-indigo-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700 backdrop-blur-xl dark:border-indigo-400/15 dark:bg-white/[0.03] dark:text-indigo-200">
              {locale === 'hi' ? 'मॉड्यूल' : 'Modules'}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {locale === 'hi'
                ? 'टर्म और कोर्स के साथ संरचित सीखना'
                : 'Structured learning across terms and courses'}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {locale === 'hi'
                ? 'हर मॉड्यूल में स्पष्ट कवर, प्रगति ट्रैकिंग और गहरा कंटेंट।'
                : 'Each module has a clear cover, progress tracking, and rich content paths.'}
            </p>
          </div>
          <Link
            href={`/${locale}/login`}
            className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 backdrop-blur-xl transition-colors hover:border-indigo-400/30 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.06]"
          >
            {locale === 'hi' ? 'मॉड्यूल देखें' : 'Browse modules'}
          </Link>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, index) => (
            <motion.article
              key={mod.titleEn}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/30 hover:shadow-[0_18px_50px_-24px_rgba(99,102,241,0.2)] dark:border-white/8 dark:bg-white/[0.04] dark:hover:border-indigo-400/22"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={mod.image}
                  alt={locale === 'hi' ? mod.titleHi : mod.titleEn}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                  <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {mod.terms} {locale === 'hi' ? 'टर्म' : mod.terms === 1 ? 'term' : 'terms'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {locale === 'hi' ? mod.titleHi : mod.titleEn}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {locale === 'hi'
                    ? 'कवर इमेज, टर्म ब्रेकडाउन और कोर्स कार्ड — डैशबोर्ड जैसा अनुभव।'
                    : 'Cover art, term breakdown, and course cards — dashboard-style flow.'}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
