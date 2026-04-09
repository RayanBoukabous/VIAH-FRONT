'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const plans = [
  {
    nameEn: 'Starter',
    nameHi: 'स्टार्टर',
    price: '$0',
    accent: 'from-slate-600 to-slate-800',
    featuresEn: ['AI tutor access', 'Selected courses', 'Weekly analytics'],
    featuresHi: ['AI ट्यूटर एक्सेस', 'चयनित कोर्स', 'वीकली एनालिटिक्स'],
  },
  {
    nameEn: 'Pro',
    nameHi: 'प्रो',
    price: '$12',
    accent: 'from-blue-500 to-cyan-500',
    featuresEn: ['All courses', 'Adaptive quizzes', 'Premium dashboard'],
    featuresHi: ['सभी कोर्स', 'एडैप्टिव क्विज़', 'प्रीमियम डैशबोर्ड'],
    featured: true,
  },
  {
    nameEn: 'Elite',
    nameHi: 'एलीट',
    price: '$24',
    accent: 'from-violet-500 to-fuchsia-500',
    featuresEn: ['Advanced analytics', 'Priority AI support', 'Future releases'],
    featuresHi: ['एडवांस्ड एनालिटिक्स', 'प्रायोरिटी AI सपोर्ट', 'फ्यूचर रिलीज़'],
  },
];

export default function LandingPricing() {
  const locale = useLocale();

  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.03] dark:text-blue-200">
            {locale === 'hi' ? 'प्राइसिंग' : 'Pricing'}
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {locale === 'hi' ? 'हर स्तर के छात्र के लिए लचीली योजना' : 'Flexible plans for every level of ambition'}
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.nameEn}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.015 }}
              className={`relative overflow-hidden rounded-[30px] border p-[1px] ${
                plan.featured ? 'border-cyan-400/40' : 'border-slate-200 dark:border-white/8'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.accent} opacity-[0.16]`} />
              <div className="relative rounded-[29px] bg-white/92 p-6 backdrop-blur-xl dark:bg-[#0E1526]/92">
                {plan.featured ? (
                  <div className="mb-5 inline-flex rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {locale === 'hi' ? 'सबसे लोकप्रिय' : 'Most popular'}
                  </div>
                ) : null}
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">{locale === 'hi' ? plan.nameHi : plan.nameEn}</h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-black text-slate-950 dark:text-white">{plan.price}</span>
                  <span className="pb-2 text-sm text-slate-400">{locale === 'hi' ? '/महीना' : '/month'}</span>
                </div>
                <div className="mt-6 space-y-3">
                  {(locale === 'hi' ? plan.featuresHi : plan.featuresEn).map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/${locale}/signup`}
                  className={`mt-8 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl bg-gradient-to-r ${plan.accent} text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(59,130,246,0.72)] transition-transform duration-300 hover:scale-[1.02]`}
                >
                  {locale === 'hi' ? 'प्लान चुनें' : 'Choose plan'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
