'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiError, getGoogleAuthUrl, login } from '@/lib/api';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        o: Math.random() * 0.45 + 0.12,
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
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - d / 120)})`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ username, password });
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t('error'));
      } else {
        setError(t('error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    window.location.assign(getGoogleAuthUrl());
  };

  const features: { Icon: React.ElementType; text: string }[] = [
    {
      Icon: SmartToyOutlined,
      text: locale === 'en' ? 'AI tutor & instant help' : 'AI ट्यूटर और तुरंत मदद',
    },
    {
      Icon: MenuBookOutlined,
      text: locale === 'en' ? 'National curriculum aligned' : 'राष्ट्रीय पाठ्यक्रम के अनुरूप',
    },
    {
      Icon: InsightsOutlined,
      text: locale === 'en' ? 'Smart progress insights' : 'स्मार्ट प्रगति इनसाइट्स',
    },
  ];

  const leftVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const leftItem = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const inputClass =
    'block w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-primary/40 dark:focus:border-cyan-500/35 focus:bg-white dark:focus:bg-white/[0.06] transition-all shadow-sm dark:shadow-none';

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 overflow-hidden relative">
      {/* Particles canvas — subtle on light, vivid on dark */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-100" aria-hidden />
      <div className="fixed inset-0 z-0 pointer-events-none dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(52,150,226,0.18),transparent_55%)]" />
      <div className="fixed top-1/4 -left-32 w-[420px] h-[420px] rounded-full bg-blue-400/10 dark:bg-blue-600/15 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/8 dark:bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

      <Link
        href={`/${locale}`}
        className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.05] backdrop-blur-md text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white hover:border-primary/30 dark:hover:border-cyan-500/30 hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-300 group shadow-sm dark:shadow-lg dark:shadow-black/20"
      >
        <svg className="w-4 h-4 text-primary dark:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {locale === 'en' ? 'Home' : 'होम'}
      </Link>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left — brand */}
        <motion.div
          variants={leftVariants}
          initial="hidden"
          animate="show"
          className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative flex-col justify-center px-12 xl:px-16 py-16 border-r border-slate-200 dark:border-white/[0.06]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 dark:from-blue-950/40 via-transparent to-cyan-50/50 dark:to-cyan-950/20 pointer-events-none" />
          <div className="absolute top-20 right-0 w-px h-40 bg-gradient-to-b from-transparent via-primary/30 dark:via-cyan-400/40 to-transparent" />

          <motion.div variants={leftItem} className="relative mb-10">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 dark:bg-blue-500/10 blur-2xl opacity-60" />
            <Image
              src="/assets/logo/logo_viah.png"
              alt="VIAH"
              width={260}
              height={84}
              className="relative h-16 w-auto dark:brightness-110 drop-shadow-[0_0_24px_rgba(52,150,226,0.2)] dark:drop-shadow-[0_0_24px_rgba(52,150,226,0.35)]"
              priority
            />
          </motion.div>

          <motion.h1 variants={leftItem} className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-primary-dark to-primary dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text text-transparent">
              {locale === 'en' ? 'Welcome back' : 'वापसी पर स्वागत है'}
            </span>
          </motion.h1>
          <motion.p variants={leftItem} className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
            {locale === 'en'
              ? 'Sign in to continue your AI-powered learning journey — built for students across India.'
              : 'अपनी AI-संचालित सीखने की यात्रा जारी रखने के लिए साइन इन करें — भारत के छात्रों के लिए।'}
          </motion.p>

          <ul className="space-y-3">
            {features.map(({ Icon, text }, i) => (
              <motion.li
                key={i}
                variants={leftItem}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm hover:border-primary/30 dark:hover:border-cyan-500/25 hover:bg-white dark:hover:bg-cyan-500/[0.04] transition-all duration-300"
              >
                <span className="text-primary dark:text-cyan-300/90 shrink-0">
                  <Icon className="!w-5 !h-5" />
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{text}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={leftItem} className="mt-12 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            <span className="w-8 h-px bg-gradient-to-r from-primary/50 dark:from-cyan-500/50 to-transparent" />
            VIAH · India
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 lg:py-12 pt-24 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-[440px]"
          >
            <div className="lg:hidden flex justify-center mb-8">
              <Image
                src="/assets/logo/logo_viah.png"
                alt="VIAH"
                width={200}
                height={64}
                className="h-12 w-auto dark:brightness-110"
                priority
              />
            </div>

            <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/30 dark:from-cyan-500/40 via-primary/20 dark:via-blue-500/25 to-primary/25 dark:to-violet-500/30 shadow-xl dark:shadow-2xl dark:shadow-blue-950/50">
              <div className="rounded-[22px] bg-white dark:bg-[#0a1628]/95 backdrop-blur-xl border border-slate-100 dark:border-white/[0.06] p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 dark:bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 dark:border-cyan-500/25 bg-primary/5 dark:bg-cyan-500/10 text-primary dark:text-cyan-300/90 text-xs font-semibold mb-4">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary dark:bg-cyan-400" />
                    </span>
                    {locale === 'en' ? 'Secure sign-in' : 'सुरक्षित साइन-इन'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('title')}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{t('subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl border border-rose-400/35 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-200"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">
                      {t('usernameOrEmail')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-primary dark:group-focus-within:text-cyan-400 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputClass}
                        placeholder={locale === 'en' ? 'username or email' : 'यूज़रनेम या ईमेल'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">
                      {t('password')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-primary dark:group-focus-within:text-cyan-400 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} !pl-11 !pr-12`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-cyan-300 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 text-primary focus:ring-primary/40 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">{t('remember')}</span>
                    </label>
                    <Link
                      href={`/${locale}/forgot-password`}
                      className="text-sm font-semibold text-primary dark:text-cyan-400 hover:text-primary-dark dark:hover:text-cyan-300 transition-colors"
                    >
                      {t('forgot')}
                    </Link>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="group relative w-full py-4 rounded-xl font-bold text-base text-white overflow-hidden disabled:opacity-55 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                    style={{ background: 'linear-gradient(135deg, #3496E2 0%, #164780 55%, #0ea5e9 100%)' }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {submitting ? (
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      ) : (
                        <>
                          {t('signIn')}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </motion.button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0a1628]">
                        {t('continueWith')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.08] hover:border-primary/25 dark:hover:border-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm dark:shadow-none"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>

                  <p className="text-center text-sm text-slate-500 dark:text-slate-500 pt-2">
                    {t('noAccount')}{' '}
                    <Link href={`/${locale}/signup`} className="font-semibold text-primary dark:text-cyan-400 hover:text-primary-dark dark:hover:text-cyan-300 transition-colors">
                      {t('signUp')}
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
