'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import StarRounded from '@mui/icons-material/StarRounded';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';

type Testimonial = {
  initials: string;
  nameEn: string;
  nameHi: string;
  roleEn: string;
  roleHi: string;
  quoteEn: string;
  quoteHi: string;
  rating: number;
  gradient: string;
  cityShortEn: string;
  cityShortHi: string;
};

const testimonials: Testimonial[] = [
  {
    initials: 'AR',
    nameEn: 'Arjun Rao',
    nameHi: 'अर्जुन राव',
    roleEn: 'Class 10 Student, Bangalore',
    roleHi: 'कक्षा 10 छात्र, बैंगलोर',
    quoteEn:
      'VIAH completely transformed how I study. The AI tutor explains concepts in a way my textbook never could. My marks improved by 30% in just 2 months!',
    quoteHi:
      'VIAH ने मेरे पढ़ने के तरीके को बदल दिया। AI ट्यूटर ऐसे समझाता है जैसे मेरी किताब कभी नहीं समझा सकी। 2 महीने में मेरे अंक 30% बढ़ गए!',
    rating: 5,
    gradient: 'from-blue-500 to-blue-700',
    cityShortEn: 'Bangalore',
    cityShortHi: 'बैंगलोर',
  },
  {
    initials: 'PS',
    nameEn: 'Priya Sharma',
    nameHi: 'प्रिया शर्मा',
    roleEn: 'Class 12 Student, Delhi',
    roleHi: 'कक्षा 12 छात्रा, दिल्ली',
    quoteEn:
      'The animated videos and interactive quizzes make learning fun. I finally understand physics! The Hindi support is amazing for topics I struggled with.',
    quoteHi:
      'एनिमेटेड वीडियो और इंटरेक्टिव क्विज़ सीखने को मज़ेदार बनाते हैं। मैं आखिरकार फिजिक्स समझ गई! हिंदी सपोर्ट उन विषयों के लिए बेहतरीन है जिनमें मुझे कठिनाई थी।',
    rating: 5,
    gradient: 'from-violet-500 to-purple-700',
    cityShortEn: 'Delhi',
    cityShortHi: 'दिल्ली',
  },
  {
    initials: 'RK',
    nameEn: 'Rahul Kumar',
    nameHi: 'राहुल कुमार',
    roleEn: 'Class 8 Student, Mumbai',
    roleHi: 'कक्षा 8 छात्र, मुंबई',
    quoteEn:
      "The personalized learning path is incredible. VIAH knows exactly where I'm weak and focuses on those areas. It's like having a private tutor 24/7.",
    quoteHi:
      'व्यक्तिगत सीखने का रास्ता अविश्वसनीय है। VIAH जानता है मेरी कमजोरियां कहां हैं और उन पर ध्यान देता है। यह 24/7 प्राइवेट ट्यूटर होने जैसा है।',
    rating: 5,
    gradient: 'from-cyan-500 to-blue-600',
    cityShortEn: 'Mumbai',
    cityShortHi: 'मुंबई',
  },
];

export default function Testimonials() {
  const locale = useLocale();

  return (
    <section className="relative w-full py-24 bg-transparent overflow-hidden border-t border-slate-200/70 dark:border-white/[0.06]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/30 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] h-[min(700px,90vw)] bg-blue-300/10 dark:bg-blue-900/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/25 dark:border-blue-400/30 bg-white/70 dark:bg-blue-400/10 text-primary-dark dark:text-blue-300 text-sm font-semibold mb-5 shadow-sm dark:shadow-none">
            {locale === 'en' ? 'Student stories' : 'छात्रों की कहानियां'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5">
            {locale === 'en' ? (
              <>
                What our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  students say
                </span>
              </>
            ) : (
              <>
                हमारे{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  छात्र क्या कहते हैं
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Real stories from real students across India'
              : 'भारत भर के वास्तविक छात्रों की वास्तविक कहानियां'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative p-7 rounded-2xl border border-slate-200/90 dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.03] backdrop-blur-md overflow-hidden transition-all duration-300 flex flex-col shadow-sm dark:shadow-none"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(52,150,226,0.07) 0%, transparent 70%)' }}
              />

              <div className="relative z-10 text-primary/15 dark:text-blue-400/15 text-7xl font-serif leading-none mb-2 select-none">"</div>

              <div className="relative z-10 flex gap-0.5 mb-4">
                {[...Array(row.rating)].map((_, s) => (
                  <StarRounded key={s} className="!w-[18px] !h-[18px] text-amber-500" />
                ))}
              </div>

              <p className="relative z-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm flex-1 mb-6">
                &ldquo;{locale === 'en' ? row.quoteEn : row.quoteHi}&rdquo;
              </p>

              <div className="relative z-10 flex items-center gap-3 pt-5 border-t border-slate-200/90 dark:border-white/[0.06]">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${row.gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                >
                  {row.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-slate-900 dark:text-white font-semibold text-sm truncate">
                    {locale === 'en' ? row.nameEn : row.nameHi}
                  </div>
                  <div className="text-slate-500 dark:text-slate-500 text-xs truncate">
                    {locale === 'en' ? row.roleEn : row.roleHi}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-slate-500 dark:text-slate-500 text-xs font-medium">
                  <LocationOnOutlined className="!w-4 !h-4 text-primary/70 dark:text-sky-400/80" />
                  {locale === 'en' ? row.cityShortEn : row.cityShortHi}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { Icon: EmojiEventsOutlined, textEn: '#1 rated EdTech', textHi: '#1 रेटेड एडटेक' },
            { Icon: LockOutlined, textEn: 'Safe & secure', textHi: 'सुरक्षित' },
            { Icon: PhoneIphoneOutlined, textEn: 'Mobile friendly', textHi: 'मोबाइल रेडी' },
            { Icon: LanguageOutlined, textEn: 'Multi-language', textHi: 'बहु-भाषा' },
          ].map(({ Icon, textEn, textHi }, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <Icon className="!w-[18px] !h-[18px] text-primary dark:text-sky-400/90" />
              <span>{locale === 'en' ? textEn : textHi}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
