'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Arjun Rao',
    roleEn: 'Class 10 Student',
    roleHi: 'कक्षा 10 छात्र',
    quoteEn: 'The AI tutor feels like having a private mentor who actually understands where I get stuck.',
    quoteHi: 'AI ट्यूटर ऐसा लगता है जैसे कोई प्राइवेट मेंटर मेरी असली कठिनाइयों को समझ रहा हो।',
  },
  {
    name: 'Priya Sharma',
    roleEn: 'Class 12 Student',
    roleHi: 'कक्षा 12 छात्रा',
    quoteEn: 'The UI feels premium, fast, and motivating. I want to come back every day and keep learning.',
    quoteHi: 'यह इंटरफेस प्रीमियम, तेज़ और मोटिवेटिंग लगता है। मैं हर दिन वापस आकर सीखना चाहती हूँ।',
  },
  {
    name: 'Rahul Kumar',
    roleEn: 'Class 8 Student',
    roleHi: 'कक्षा 8 छात्र',
    quoteEn: 'Short lessons, smart recommendations, and visual progress made studying finally feel manageable.',
    quoteHi: 'छोटे लेसन, स्मार्ट सुझाव और साफ़ प्रोग्रेस विज़ुअल्स ने पढ़ाई को सच में आसान बना दिया।',
  },
];

export default function LandingTestimonials() {
  const locale = useLocale();

  return (
    <section className="px-4 py-20 sm:px-5 sm:py-24 lg:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-[min(100%,1320px)] 2xl:max-w-[1600px]">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <div className="mb-4 inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.03] dark:text-blue-200">
            {locale === 'hi' ? 'टेस्टिमोनियल्स' : 'Testimonials'}
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {locale === 'hi' ? 'छात्र सिर्फ सीख नहीं रहे, वे आगे बढ़ रहे हैं' : 'Students are not just learning. They are accelerating.'}
          </h2>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              initial={false}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-6 backdrop-blur-xl transition-shadow duration-300 hover:border-cyan-400/30 hover:shadow-[0_18px_50px_-24px_rgba(59,130,246,0.18)] dark:border-white/8 dark:bg-white/[0.04] dark:hover:border-cyan-400/22 dark:hover:shadow-[0_18px_50px_-24px_rgba(59,130,246,0.55)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_28%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">
                  “{locale === 'hi' ? item.quoteHi : item.quoteEn}”
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-white/8 pt-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                    {item.name.split(' ').map((x) => x[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{locale === 'hi' ? item.roleHi : item.roleEn}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
