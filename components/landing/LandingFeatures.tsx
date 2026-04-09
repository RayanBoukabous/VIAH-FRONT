'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const items = [
  {
    en: 'AI Tutor',
    hi: 'AI ट्यूटर',
    descEn: 'Ask questions, get guided explanations, and receive adaptive study support in real time.',
    descHi: 'रियल टाइम में प्रश्न पूछें, स्टेप-बाय-स्टेप समझें और अनुकूलित अध्ययन सहायता पाएं।',
    icon: 'AI',
  },
  {
    en: 'Interactive Courses',
    hi: 'इंटरेक्टिव कोर्स',
    descEn: 'Lessons, quizzes, and modern learning flows designed to keep students engaged longer.',
    descHi: 'लेसन, क्विज़ और आधुनिक लर्निंग फ्लो जो छात्रों को लंबे समय तक एंगेज रखें।',
    icon: 'IQ',
  },
  {
    en: 'Progress Intelligence',
    hi: 'प्रोग्रेस इंटेलिजेंस',
    descEn: 'Track momentum with live analytics, weekly goals, and personalized recommendations.',
    descHi: 'लाइव एनालिटिक्स, वीकली गोल्स और स्मार्ट सुझावों के साथ अपनी प्रगति ट्रैक करें।',
    icon: 'PI',
  },
  {
    en: 'Bilingual Learning',
    hi: 'द्विभाषी सीखना',
    descEn: 'Switch between English and Hindi to learn with more confidence and clarity.',
    descHi: 'अधिक स्पष्टता और आत्मविश्वास के साथ सीखने के लिए अंग्रेज़ी और हिंदी में स्विच करें।',
    icon: 'EN',
  },
  {
    en: 'Student-first Design',
    hi: 'स्टूडेंट-फर्स्ट डिज़ाइन',
    descEn: 'A distraction-free, beautifully structured interface built for flow and focus.',
    descHi: 'फोकस और फ्लो के लिए बनाया गया एक साफ, सुंदर और कम-डिस्ट्रैक्शन इंटरफेस।',
    icon: 'UX',
  },
  {
    en: 'Future-ready Platform',
    hi: 'फ्यूचर-रेडी प्लेटफॉर्म',
    descEn: 'Built to scale with smart systems, premium interactions, and AI-native architecture.',
    descHi: 'स्मार्ट सिस्टम्स, प्रीमियम इंटरैक्शन और AI-नेटिव आर्किटेक्चर के साथ स्केल करने के लिए तैयार।',
    icon: 'OS',
  },
];

export default function LandingFeatures() {
  const locale = useLocale();

  return (
    <section id="features" className="px-4 py-20 sm:px-5 sm:py-24 lg:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-[min(100%,1320px)] 2xl:max-w-[1600px]">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <div className="mb-4 inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.03] dark:text-blue-200">
            {locale === 'hi' ? 'फीचर्स' : 'Features'}
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {locale === 'hi' ? 'एक प्रीमियम लर्निंग सिस्टम, सिर्फ कंटेंट नहीं' : 'More than content. A premium learning system.'}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {locale === 'hi'
              ? 'हर सेक्शन को इस तरह डिजाइन किया गया है कि छात्र प्रेरित रहें, तेज सीखें और लगातार प्रगति करें।'
              : 'Every part of the experience is designed to keep students motivated, moving faster, and learning with confidence.'}
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.en}
              initial={false}
              whileHover={{ y: -6, scale: 1.012 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-6 backdrop-blur-xl transition-shadow duration-300 hover:border-cyan-400/30 hover:shadow-[0_18px_50px_-24px_rgba(59,130,246,0.20)] dark:border-white/8 dark:bg-white/[0.04] dark:hover:border-cyan-400/22 dark:hover:shadow-[0_18px_50px_-24px_rgba(59,130,246,0.55)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_26%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-sm font-black text-white shadow-[0_18px_30px_-18px_rgba(59,130,246,0.8)]">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{locale === 'hi' ? item.hi : item.en}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{locale === 'hi' ? item.descHi : item.descEn}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                  <span>{locale === 'hi' ? 'और जानें' : 'Learn more'}</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
