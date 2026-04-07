'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import LaptopChromebookOutlined from '@mui/icons-material/LaptopChromebookOutlined';
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

type Step = {
  number: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  icon: React.ReactNode;
  gradient: string;
  borderGlow: string;
};

const steps: Step[] = [
  {
    number: '01',
    titleEn: 'Create Your Account',
    titleHi: 'अपना अकाउंट बनाएं',
    descEn: 'Sign up in seconds. Choose your grade level, subjects, and preferred language — Hindi or English.',
    descHi: 'कुछ सेकंड में साइन अप करें। अपना ग्रेड लेवल, विषय और पसंदीदा भाषा चुनें — हिंदी या अंग्रेजी।',
    gradient: 'from-blue-500 to-blue-700',
    borderGlow: 'rgba(59,130,246,0.4)',
    icon: <PersonAddOutlined className="!w-9 !h-9" />,
  },
  {
    number: '02',
    titleEn: 'Learn with AI',
    titleHi: 'AI के साथ सीखें',
    descEn: 'Watch animated lessons, interact with your AI tutor, take adaptive quizzes — learn at your own pace, anytime.',
    descHi: 'एनिमेटेड पाठ देखें, AI ट्यूटर से बात करें, अनुकूली क्विज़ लें — अपनी गति से सीखें, कभी भी।',
    gradient: 'from-cyan-500 to-blue-600',
    borderGlow: 'rgba(6,182,212,0.4)',
    icon: <LaptopChromebookOutlined className="!w-9 !h-9" />,
  },
  {
    number: '03',
    titleEn: 'Track & Excel',
    titleHi: 'ट्रैक करें और आगे बढ़ें',
    descEn: 'Monitor your progress with smart analytics. Get personalized recommendations and see your skills grow day by day.',
    descHi: 'स्मार्ट एनालिटिक्स से अपनी प्रगति देखें। व्यक्तिगत सुझाव पाएं और अपने कौशल को दिन-प्रतिदिन बढ़ते देखें।',
    gradient: 'from-violet-500 to-purple-700',
    borderGlow: 'rgba(139,92,246,0.4)',
    icon: <AssessmentOutlined className="!w-9 !h-9" />,
  },
];

export default function HowItWorks() {
  const locale = useLocale();

  return (
    <section className="relative w-full py-24 bg-transparent overflow-hidden border-t border-slate-200/70 dark:border-white/[0.06]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-500/30 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-300/15 dark:bg-violet-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-900/15 rounded-full blur-[100px]" />
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
            {locale === 'en' ? 'How it works' : 'यह कैसे काम करता है'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5">
            {locale === 'en' ? (
              <>
                Start learning in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  3 simple steps
                </span>
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  3 सरल चरणों
                </span>{' '}
                में सीखना शुरू करें
              </>
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Designed to be simple, powerful, and effective for every Indian student.'
              : 'हर भारतीय छात्र के लिए सरल, शक्तिशाली और प्रभावी।'}
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          <div className="hidden md:block absolute top-[72px] left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-blue-500/35 via-cyan-500/35 to-violet-500/35 dark:from-blue-500/40 dark:via-cyan-500/40 dark:to-violet-500/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-violet-500/15 blur-sm" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-200/90 dark:border-white/[0.07] bg-white/75 dark:bg-white/[0.03] backdrop-blur-md transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ boxShadow: `0 0 60px ${step.borderGlow}, inset 0 0 40px ${step.borderGlow}20` }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl border"
                style={{ borderColor: step.borderGlow }}
              />

              <div className="relative z-10 mb-6">
                <div
                  className={`w-[88px] h-[88px] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}
                >
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-primary dark:text-blue-400">{step.number}</span>
                </div>
              </div>

              <h3 className="relative z-10 text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-blue-100 transition-colors">
                {locale === 'en' ? step.titleEn : step.titleHi}
              </h3>
              <p className="relative z-10 text-slate-600 dark:text-slate-400 leading-relaxed text-sm group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                {locale === 'en' ? step.descEn : step.descHi}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 dark:text-slate-500 text-sm flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircleOutline className="!w-4 !h-4 text-emerald-600 dark:text-emerald-400" />
              {locale === 'en' ? 'Free to start' : 'मुफ्त शुरुआत'}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircleOutline className="!w-4 !h-4 text-emerald-600 dark:text-emerald-400" />
              {locale === 'en' ? 'No credit card' : 'कार्ड नहीं'}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircleOutline className="!w-4 !h-4 text-emerald-600 dark:text-emerald-400" />
              {locale === 'en' ? 'Cancel anytime' : 'कभी रद्द करें'}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
