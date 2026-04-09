'use client';

import { useLocale } from 'next-intl';
export default function LandingExperience() {
  const locale = useLocale();

  return (
    <section className="px-4 py-20 sm:px-5 sm:py-24 lg:px-8 xl:px-10">
      <div className="mx-auto grid w-full max-w-[min(100%,1320px)] items-center gap-10 lg:gap-12 xl:grid-cols-[0.9fr_1.1fr] xl:gap-14 2xl:max-w-[1600px]">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur-xl dark:border-blue-400/15 dark:bg-white/[0.03] dark:text-blue-200">
            {locale === 'hi' ? 'एक्सपीरियंस' : 'Experience'}
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {locale === 'hi' ? 'एक ऐसा इंटरफेस जो पढ़ाई को प्रोडक्टिव और खूबसूरत बनाता है' : 'An interface that makes studying feel productive and beautiful'}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {locale === 'hi'
              ? 'VIAH का डैशबोर्ड सिर्फ डेटा नहीं दिखाता। यह छात्रों को दिशा देता है: क्या पढ़ना है, कहाँ सुधार करना है, और आगे क्या करना है।'
              : 'The VIAH experience does more than surface data. It tells students what to study next, where to improve, and how to keep momentum without cognitive overload.'}
          </p>
          <div className="mt-8 space-y-4">
            {[
              locale === 'hi' ? 'AI-संचालित सुझाव और रीयल-टाइम प्रगति' : 'AI suggestions with real-time progress context',
              locale === 'hi' ? 'साफ़, तेज़ और डिस्ट्रैक्शन-फ्री फ्लो' : 'Clean, fast, distraction-free learning flow',
              locale === 'hi' ? 'मोबाइल और डेस्कटॉप दोनों पर स्मूद अनुभव' : 'Smooth across both mobile and desktop',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-500/18 blur-[90px]" />
          <div className="absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-cyan-500/14 blur-[90px]" />
          <div className="relative rounded-[34px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.88))] p-4 backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 dark:border-white/8 dark:bg-[#0E1526]/92">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{locale === 'hi' ? 'लाइव डैशबोर्ड' : 'Live dashboard'}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Student OS</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                  Premium
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-white/8 dark:bg-white/[0.03]">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{locale === 'hi' ? 'वीकली फ्लो' : 'Weekly flow'}</p>
                      <span className="text-xs text-cyan-300">+21%</span>
                    </div>
                    <div className="flex h-28 items-end gap-2">
                      {[42, 58, 51, 72, 65, 84, 76].map((v, i) => (
                        <div key={i} className="flex-1 rounded-t-2xl bg-gradient-to-t from-blue-500 to-cyan-400" style={{ height: `${v}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-white/8 dark:bg-white/[0.03]">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{locale === 'hi' ? 'AI रिकमेंडेशन' : 'AI recommendation'}</p>
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">Live</span>
                    </div>
                    <div className="rounded-2xl bg-white p-4 dark:bg-white/[0.04]">
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {locale === 'hi'
                          ? 'आज Physics revision + 1 adaptive quiz complete करें।'
                          : 'Today: complete Physics revision plus one adaptive quiz to reinforce retention.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-white/8 dark:bg-white/[0.03]">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{locale === 'hi' ? 'मास्टरी' : 'Mastery'}</p>
                    <p className="mt-3 text-4xl font-black text-slate-950 dark:text-white">84%</p>
                    <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-white/8">
                      <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-white/8 dark:bg-white/[0.03]">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{locale === 'hi' ? 'अगला लक्ष्य' : 'Next target'}</p>
                    <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{locale === 'hi' ? 'रसायन विज्ञान टेस्ट' : 'Chemistry test'}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{locale === 'hi' ? '2 दिन बचे' : 'Due in 2 days'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
