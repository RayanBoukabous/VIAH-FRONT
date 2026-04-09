'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);

  return (
    <motion.span>
      {value}
      {suffix}
    </motion.span>
  );
}

export default function LandingStats() {
  const locale = useLocale();

  const stats = [
    { to: 50, suffix: 'K+', label: locale === 'hi' ? 'एक्टिव छात्र' : 'Active students' },
    { to: 120, suffix: '+', label: locale === 'hi' ? 'प्रीमियम कोर्स' : 'Premium courses' },
    { to: 98, suffix: '%', label: locale === 'hi' ? 'सक्सेस रेट' : 'Success rate' },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="rounded-[30px] border border-slate-200 bg-white/80 p-7 backdrop-blur-xl dark:border-white/8 dark:bg-white/[0.04]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-200">
            {locale === 'hi' ? 'विश्वास' : 'Trusted at scale'}
          </p>
          <h3 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
            {locale === 'hi' ? 'भारत भर के छात्रों द्वारा पसंद किया गया' : 'Built for the students who want to move faster'}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {locale === 'hi'
              ? 'हमारी AI-फर्स्ट लर्निंग प्रणाली छात्रों को सिर्फ पढ़ने नहीं, बल्कि लगातार बेहतर होने में मदद करती है।'
              : 'Our AI-first learning experience helps students do more than study. It helps them improve with rhythm, confidence, and measurable momentum.'}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-[26px] border border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-white/8 dark:bg-white/[0.04]"
            >
              <div className="text-4xl font-black text-slate-950 dark:text-white">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
