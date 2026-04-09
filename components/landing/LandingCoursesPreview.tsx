'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const courses = [
  { titleEn: 'Mathematics Mastery', titleHi: 'मैथ्स मास्टरी', level: 'Grade 10', rating: '4.9', accent: 'from-blue-500 to-cyan-500' },
  { titleEn: 'Physics in Motion', titleHi: 'फिजिक्स इन मोशन', level: 'Grade 11', rating: '4.8', accent: 'from-indigo-500 to-violet-500' },
  { titleEn: 'English Fluency Lab', titleHi: 'इंग्लिश फ्लुएंसी लैब', level: 'Grade 9', rating: '4.9', accent: 'from-cyan-500 to-sky-500' },
  { titleEn: 'Political Science Pro', titleHi: 'पॉलिटिकल साइंस प्रो', level: 'Grade 12', rating: '4.7', accent: 'from-violet-500 to-fuchsia-500' },
];

export default function LandingCoursesPreview() {
  const locale = useLocale();

  return (
    <section id="courses" className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.03] dark:text-blue-200">
              {locale === 'hi' ? 'कोर्स प्रीव्यू' : 'Courses preview'}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {locale === 'hi' ? 'ऐसे कोर्स जो छात्रों को वापस आने पर मजबूर करें' : 'Courses that feel immersive, modern, and motivating'}
            </h2>
          </div>
          <Link
            href={`/${locale}/login`}
            className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 backdrop-blur-xl transition-colors hover:border-cyan-400/30 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.06]"
          >
            {locale === 'hi' ? 'सभी कोर्स देखें' : 'View all courses'}
          </Link>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          {courses.map((course, index) => (
            <motion.div
              key={course.titleEn}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:shadow-[0_18px_50px_-24px_rgba(59,130,246,0.18)] dark:border-white/8 dark:bg-white/[0.04] dark:hover:border-blue-400/22 dark:hover:shadow-[0_18px_50px_-24px_rgba(59,130,246,0.55)]"
            >
              <div className={`relative h-52 bg-gradient-to-br ${course.accent}`}>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_42%,rgba(0,0,0,0.18))]" />
                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {course.level}
                </div>
                <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {course.rating} ★
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{locale === 'hi' ? course.titleHi : course.titleEn}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {locale === 'hi'
                    ? 'AI-गाइडेड लेसन, विज़ुअल फ्लो और क्विक रिविजन के साथ डीप लर्निंग अनुभव।'
                    : 'AI-guided lessons, visual flow, and quick revision moments for a deeper learning experience.'}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-cyan-300">{locale === 'hi' ? 'प्रीमियम ट्रैक' : 'Premium track'}</span>
                  <span className="text-sm font-semibold text-slate-950 transition-transform duration-300 group-hover:translate-x-1 dark:text-white">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
