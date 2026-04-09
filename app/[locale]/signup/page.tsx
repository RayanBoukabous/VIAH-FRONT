'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ApiError,
  signup,
  getLevels,
  getCurriculums,
  getSpecialities,
  type Level,
  type Speciality,
  type Curriculum,
} from '@/lib/api';
import { findCbseCurriculum, getLevelTierFromName, type SignupLevelTier } from '@/lib/signupLevelTier';
import PsychologyOutlined from '@mui/icons-material/PsychologyOutlined';
import PublicOutlined from '@mui/icons-material/PublicOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';

const STEPS = 3;

export default function SignupPage() {
  const t = useTranslations('signup');
  const locale = useLocale();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState(18);
  const [levelId, setLevelId] = useState('');
  const [curriculumId, setCurriculumId] = useState('');
  const [specialityId, setSpecialityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [levels, setLevels] = useState<Level[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [specialitiesLoading, setSpecialitiesLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    type P = { x: number; y: number; vx: number; vy: number; r: number; o: number };
    const particles: P[] = [];
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.5 + 0.4,
        o: Math.random() * 0.42 + 0.1,
      });
    }

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,150,226,${p.o})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - d / 115)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLevelsLoading(true);
      setCatalogError(false);
      try {
        const [levelList, currList] = await Promise.all([getLevels(), getCurriculums()]);
        if (!cancelled) {
          setLevels(levelList);
          setCurriculums(currList);
        }
      } catch {
        if (!cancelled) {
          setLevels([]);
          setCurriculums([]);
          setCatalogError(true);
        }
      } finally {
        if (!cancelled) setLevelsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedLevel = useMemo(() => levels.find((l) => l.id === levelId), [levels, levelId]);
  const tier: SignupLevelTier = useMemo(
    () => (selectedLevel ? getLevelTierFromName(selectedLevel.name) : 'g910'),
    [selectedLevel]
  );

  /** Grade 9–12: clear curriculum when level changes away from K–8. */
  useEffect(() => {
    if (!levelId || !selectedLevel) return;
    if (getLevelTierFromName(selectedLevel.name) === 'k8') return;
    setCurriculumId('');
  }, [levelId, selectedLevel]);

  /** K–8: lock to CBSE from catalog when levels + curriculums are known. */
  useEffect(() => {
    if (!levelId || !selectedLevel || !curriculums.length) return;
    if (getLevelTierFromName(selectedLevel.name) !== 'k8') return;
    const cbse = findCbseCurriculum(curriculums);
    if (cbse) setCurriculumId(cbse.id);
    else setCurriculumId('');
  }, [levelId, selectedLevel, curriculums]);

  useEffect(() => {
    if (!levelId) {
      setSpecialities([]);
      setSpecialityId('');
      return;
    }
    if (tier !== 'g1112') {
      setSpecialities([]);
      setSpecialityId('');
      return;
    }

    let cancelled = false;
    (async () => {
      setSpecialitiesLoading(true);
      setSpecialityId('');
      try {
        const list = await getSpecialities();
        if (!cancelled) setSpecialities(list);
      } catch {
        if (!cancelled) {
          setSpecialities([]);
          setCatalogError(true);
        }
      } finally {
        if (!cancelled) setSpecialitiesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [levelId, tier]);

  const filteredSpecialities = useMemo(() => {
    if (!levelId || !curriculumId) return [];
    return specialities.filter(
      (s) => s.levelId === levelId && s.curriculumId === curriculumId
    );
  }, [specialities, levelId, curriculumId]);

  useEffect(() => {
    setSpecialityId((prev) => {
      if (!prev) return prev;
      return filteredSpecialities.some((s) => s.id === prev) ? prev : '';
    });
  }, [filteredSpecialities]);

  const inputClass =
    'block w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-primary/40 dark:focus:border-cyan-500/35 focus:bg-white dark:focus:bg-white/[0.06] transition-all shadow-sm dark:shadow-none';
  const selectClass = `${inputClass} appearance-none cursor-pointer disabled:opacity-50`;

  const canGoStep2 = email.trim() && username.trim() && password.length >= 1;
  const canGoStep3 = firstName.trim() && lastName.trim() && age >= 1 && age <= 120;

  const cbseCurriculum = findCbseCurriculum(curriculums);
  const k8CbseMissing = tier === 'k8' && curriculums.length > 0 && !cbseCurriculum;

  const g1112Blocked =
    tier === 'g1112' &&
    !specialitiesLoading &&
    !!levelId &&
    !!curriculumId &&
    filteredSpecialities.length === 0;
  const g1112NeedsSpecialityPick = tier === 'g1112' && filteredSpecialities.length > 0;

  const step3Ready =
    Boolean(levelId && curriculumId) &&
    (!g1112NeedsSpecialityPick || !!specialityId) &&
    !g1112Blocked &&
    !levelsLoading &&
    !(tier === 'g1112' && specialitiesLoading) &&
    !k8CbseMissing;

  const nextStep = () => {
    setError(null);
    if (step === 1 && !canGoStep2) return;
    if (step === 2 && !canGoStep3) return;
    setStep((s) => Math.min(STEPS, s + 1));
  };

  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== STEPS) return;
    setError(null);
    setSubmitting(true);
    try {
      const lv = levels.find((l) => l.id === levelId);
      const tierSubmit: SignupLevelTier = lv ? getLevelTierFromName(lv.name) : 'g910';
      await signup({
        email,
        username,
        firstName,
        lastName,
        password,
        studentData: {
          age: Number(age),
          levelId,
          curriculumId,
          ...(tierSubmit === 'g1112' && specialityId ? { specialityId } : {}),
        },
      });
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(t('conflict'));
      } else {
        setError(t('error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const features: { Icon: React.ElementType; text: string }[] = [
    {
      Icon: PsychologyOutlined,
      text: locale === 'en' ? 'AI-personalized learning paths' : 'AI-व्यक्तिगत सीखने के रास्ते',
    },
    {
      Icon: PublicOutlined,
      text: locale === 'en' ? 'Built for India — Hindi & English' : 'भारत के लिए — हिंदी और अंग्रेजी',
    },
    {
      Icon: InsightsOutlined,
      text: locale === 'en' ? 'Progress tracking & smart insights' : 'प्रगति ट्रैकिंग और स्मार्ट इनसाइट्स',
    },
  ];

  const stepLabels =
    locale === 'en'
      ? ['Account', 'Profile', 'Academic']
      : ['खाता', 'प्रोफ़ाइल', 'अकादमिक'];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 32 : -32, opacity: 0 }),
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-100" aria-hidden />
      <div className="fixed inset-0 z-0 pointer-events-none dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(52,150,226,0.15),transparent_55%)]" />
      <div className="fixed top-1/4 -left-40 w-[480px] h-[480px] rounded-full bg-violet-400/8 dark:bg-violet-600/12 blur-[110px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-cyan-400/8 dark:bg-cyan-500/10 blur-[130px] pointer-events-none z-0" />

      <Link
        href={`/${locale}`}
        className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.05] backdrop-blur-md text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white hover:border-primary/30 dark:hover:border-cyan-500/30 hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-300 shadow-sm dark:shadow-lg dark:shadow-black/20"
      >
        <svg className="w-4 h-4 text-primary dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {locale === 'en' ? 'Home' : 'होम'}
      </Link>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left brand */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-center px-12 xl:px-16 py-16 border-r border-slate-200 dark:border-white/[0.06] relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 dark:from-blue-950/50 via-transparent to-cyan-50/50 dark:to-cyan-950/20 pointer-events-none" />
          <div className="absolute top-24 right-8 w-px h-32 bg-gradient-to-b from-primary/40 dark:from-cyan-400/50 to-transparent" />

          <div className="relative mb-10">
            <div className="absolute -inset-6 rounded-3xl bg-primary/5 dark:bg-blue-500/15 blur-3xl opacity-70" />
            <Image
              src="/assets/logo/logo_viah.png"
              alt="VIAH"
              width={260}
              height={84}
              className="relative h-14 w-auto dark:brightness-110 drop-shadow-[0_0_28px_rgba(52,150,226,0.2)] dark:drop-shadow-[0_0_28px_rgba(52,150,226,0.4)]"
              priority
            />
          </div>

          <h1 className="relative text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-primary-dark to-primary dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text text-transparent">
              {locale === 'en' ? 'Create your future' : 'अपना भविष्य बनाएं'}
            </span>
          </h1>
          <p className="relative text-slate-600 dark:text-slate-400 text-lg max-w-md mb-10 leading-relaxed">
            {locale === 'en'
              ? "Join VIAH — India's AI learning platform. One account, infinite ways to grow."
              : 'VIAH से जुड़ें — भारत का AI लर्निंग प्लेटफॉर्म। एक खाता, असीम संभावनाएं।'}
          </p>

          <ul className="relative space-y-3 mb-12">
            {features.map(({ Icon, text }, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm"
              >
                <span className="text-primary dark:text-cyan-300/90 shrink-0">
                  <Icon className="!w-6 !h-6" />
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="relative flex items-center gap-3 text-xs text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em]">
            <span className="h-px w-12 bg-gradient-to-r from-primary/60 dark:from-cyan-500/60 to-transparent" />
            Neural learning · 2026
          </div>
        </motion.div>

        {/* Form column */}
        <div className="flex-1 flex items-center justify-center px-5 py-20 lg:py-12 pt-24 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[480px]"
          >
            <div className="lg:hidden flex justify-center mb-8">
              <Image
                src="/assets/logo/logo_viah.png"
                alt="VIAH"
                width={200}
                height={64}
                className="h-11 w-auto dark:brightness-110"
                priority
              />
            </div>

            <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-violet-400/30 dark:from-violet-500/35 via-primary/20 dark:via-blue-500/25 to-cyan-400/30 dark:to-cyan-500/35 shadow-xl dark:shadow-2xl dark:shadow-blue-950/60">
              <div className="rounded-[22px] bg-white dark:bg-[#0a1628]/95 backdrop-blur-xl border border-slate-100 dark:border-white/[0.06] p-7 sm:p-9 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-violet-400/5 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-primary/5 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative mb-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-400/25 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-200 text-xs font-semibold mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 dark:bg-violet-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500 dark:bg-violet-400" />
                    </span>
                    {locale === 'en' ? 'New student onboarding' : 'नए छात्र का ऑनबोर्डिंग'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{t('title')}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{t('subtitle')}</p>
                </div>

                {/* Step indicator */}
                <div className="relative flex items-center justify-between mb-8 gap-2">
                  {Array.from({ length: STEPS }).map((_, i) => {
                    const n = i + 1;
                    const active = step >= n;
                    return (
                      <div key={n} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center flex-1 min-w-0">
                          <motion.div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors ${
                              step === n
                                ? 'bg-gradient-to-br from-primary to-cyan-600 text-white border-primary/40 shadow-lg shadow-primary/30'
                                : active
                                  ? 'bg-primary/10 text-primary dark:text-cyan-200 border-primary/20 dark:border-blue-400/30'
                                  : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-600 border-slate-200 dark:border-white/[0.08]'
                            }`}
                            animate={step === n ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 0.35 }}
                          >
                            {n}
                          </motion.div>
                          <span className="mt-2 text-[10px] sm:text-xs font-medium text-slate-500 truncate max-w-full text-center">
                            {stepLabels[i]}
                          </span>
                        </div>
                        {i < STEPS - 1 && (
                          <div className="h-0.5 flex-1 mx-1 mb-6 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden min-w-[12px]">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-cyan-400"
                              initial={{ width: '0%' }}
                              animate={{ width: step > n ? '100%' : '0%' }}
                              transition={{ duration: 0.35 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={(e) => {
                    if (step < STEPS) {
                      e.preventDefault();
                      setDir(1);
                      nextStep();
                    } else {
                      handleSubmit(e);
                    }
                  }}
                  className="space-y-5 relative"
                >
                  {catalogError && (
                    <div role="status" className="rounded-xl border border-amber-400/35 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-100">
                      {t('catalogError')}
                    </div>
                  )}
                  <AnimatePresence mode="wait" custom={dir}>
                    {error && (
                      <motion.div
                        key="err"
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl border border-rose-400/35 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-100"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait" custom={dir}>
                    {step === 1 && (
                      <motion.div
                        key="s1"
                        custom={dir}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="space-y-4"
                      >
                        <div>
                          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            {t('email')}
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="you@school.edu"
                            autoComplete="email"
                          />
                        </div>
                        <div>
                          <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            {t('username')}
                          </label>
                          <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputClass}
                            placeholder={locale === 'en' ? 'unique_username' : 'यूज़रनेम'}
                            autoComplete="username"
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            {t('password')}
                          </label>
                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={`${inputClass} pr-12`}
                              placeholder="••••••••"
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-cyan-300 transition-colors"
                              aria-label={showPassword ? 'Hide' : 'Show'}
                            >
                              {showPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="s2"
                        custom={dir}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                              {t('firstName')}
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className={inputClass}
                              autoComplete="given-name"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                              {t('lastName')}
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className={inputClass}
                              autoComplete="family-name"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="age" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            {t('age')}
                          </label>
                          <input
                            id="age"
                            type="number"
                            min={1}
                            max={120}
                            required
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className={inputClass}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="s3"
                        custom={dir}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="space-y-4"
                      >
                        <div>
                          <label htmlFor="levelId" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            {t('level')}
                          </label>
                          <select
                            id="levelId"
                            required
                            value={levelId}
                            onChange={(e) => setLevelId(e.target.value)}
                            disabled={levelsLoading}
                            className={selectClass}
                          >
                            <option value="">{levelsLoading ? t('loadingOptions') : t('selectLevel')}</option>
                            {levels.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="curriculumId" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            {tier === 'k8' ? t('curriculumLocked') : t('curriculum')}
                          </label>
                          <select
                            id="curriculumId"
                            required
                            value={curriculumId}
                            onChange={(e) => setCurriculumId(e.target.value)}
                            disabled={levelsLoading || tier === 'k8'}
                            className={selectClass}
                          >
                            {tier === 'k8' ? (
                              cbseCurriculum ? (
                                <option value={cbseCurriculum.id}>{cbseCurriculum.name}</option>
                              ) : (
                                <option value="">{levelsLoading ? t('loadingOptions') : t('selectCurriculum')}</option>
                              )
                            ) : (
                              <>
                                <option value="">{levelsLoading ? t('loadingOptions') : t('selectCurriculum')}</option>
                                {curriculums.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                          {k8CbseMissing && (
                            <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{t('cbseMissing')}</p>
                          )}
                        </div>
                        {tier === 'g1112' && (
                          <div>
                            <label htmlFor="specialityId" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                              {t('speciality')}
                            </label>
                            <select
                              id="specialityId"
                              required={filteredSpecialities.length > 0}
                              value={specialityId}
                              onChange={(e) => setSpecialityId(e.target.value)}
                              disabled={!levelId || !curriculumId || specialitiesLoading}
                              className={selectClass}
                            >
                              <option value="">
                                {!levelId
                                  ? t('selectLevel')
                                  : !curriculumId
                                    ? t('pickCurriculumFirst')
                                    : specialitiesLoading
                                      ? t('loadingOptions')
                                      : t('selectSpeciality')}
                              </option>
                              {filteredSpecialities.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.description?.trim() ? s.description : s.name}
                                </option>
                              ))}
                            </select>
                            {g1112Blocked && (
                              <p className="mt-2 text-sm text-amber-700 dark:text-amber-200/90">{t('specialityNoMatch')}</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDir(-1);
                          prevStep();
                        }}
                        className="sm:flex-1 py-3.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all"
                      >
                        {locale === 'en' ? 'Back' : 'पीछे'}
                      </button>
                    )}
                    {step < STEPS ? (
                      <button
                        type="submit"
                        disabled={
                          (step === 1 && !canGoStep2) ||
                          (step === 2 && !canGoStep3) ||
                          (step === 3 && !step3Ready)
                        }
                        className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary via-blue-600 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 shadow-lg shadow-primary/25 disabled:opacity-45 disabled:cursor-not-allowed transition-all"
                      >
                        {locale === 'en' ? 'Continue' : 'आगे'}
                      </button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={submitting || !step3Ready}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="group flex-1 relative py-4 rounded-xl font-bold text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                        style={{ background: 'linear-gradient(135deg, #3496E2 0%, #164780 50%, #06b6d4 100%)' }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                        <span className="relative z-10">
                          {submitting ? (
                            <span className="inline-flex gap-1 justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          ) : (
                            t('submit')
                          )}
                        </span>
                      </motion.button>
                    )}
                  </div>

                  <p className="text-center text-sm text-slate-500 pt-2">
                    <Link href={`/${locale}/login`} className="font-semibold text-primary dark:text-cyan-400 hover:text-primary-dark dark:hover:text-cyan-300 transition-colors">
                      {t('backToLogin')}
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
