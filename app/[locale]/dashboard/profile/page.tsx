'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useDashboardUser } from '@/components/DashboardUserContext';
import { getMe, uploadProfileImage, getProfileImageUrl, type AuthUser } from '@/lib/api';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/80 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.22)] backdrop-blur-xl',
        'dark:border-white/[0.08] dark:bg-white/[0.045] dark:shadow-[0_18px_60px_-24px_rgba(0,0,0,0.55)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32),transparent_45%,rgba(59,130,246,0.06))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%,rgba(6,182,212,0.08))]" />
      {children}
    </div>
  );
}

function ParallaxCard({ children, className }: { children: ReactNode; className?: string }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const rotateY = (x / bounds.width - 0.5) * 10;
        const rotateX = (0.5 - y / bounds.height) * 8;
        setRotate({ x: rotateX, y: rotateY });
      }}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y, y: -2 }}
      whileHover={{ y: -8, scale: 1.012 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.6 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="mb-2 h-1.5 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200/90 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400/80 focus:ring-2 focus:ring-blue-500/25 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-100';

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400';

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  studyYear: string;
  specialty: string;
  studentId: string;
  enrollmentDate: string;
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  studyTime: string;
  averageScore: number;
};

const emptyForm = (): ProfileForm => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  studyYear: '',
  specialty: '',
  studentId: '',
  enrollmentDate: '',
  totalCourses: 0,
  completedCourses: 0,
  totalLessons: 0,
  completedLessons: 0,
  studyTime: '—',
  averageScore: 0,
});

function formFromUser(user: AuthUser, extras: Partial<ProfileForm>): ProfileForm {
  return {
    ...emptyForm(),
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    ...extras,
  };
}

export default function ProfilePage() {
  const t = useTranslations('profile');
  const locale = useLocale();
  const hi = locale === 'hi';
  const userFromLayout = useDashboardUser();
  const [isEditing, setIsEditing] = useState(false);
  const [apiUser, setApiUser] = useState<AuthUser | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const mockExtras: Partial<ProfileForm> = {
    phone: '+91 98765 43210',
    dateOfBirth: '2007-06-12',
    address: '42 Learning Lane, Mumbai, Maharashtra 400001, India',
    studyYear: 'Bac',
    specialty: 'Mathematics & Technical',
    studentId: 'VIAH2024BR001',
    enrollmentDate: '2024-09-01',
    totalCourses: 10,
    completedCourses: 3,
    totalLessons: 142,
    completedLessons: 58,
    studyTime: '89h 15min',
    averageScore: 84.2,
  };

  const [formData, setFormData] = useState<ProfileForm>(() => emptyForm());

  useEffect(() => {
    if (!userFromLayout) return;
    setApiUser(userFromLayout);
    setFormData(formFromUser(userFromLayout, mockExtras));
  }, [userFromLayout]);

  const profilePhotoUrl = getProfileImageUrl(apiUser);
  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [profilePhotoUrl]);

  const display = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (apiUser) setFormData(formFromUser(apiUser, mockExtras));
    setIsEditing(false);
  };

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    try {
      await uploadProfileImage(file);
      const user = await getMe();
      setApiUser(user);
      setFormData(formFromUser(user, mockExtras));
    } catch {
      /* keep UI stable */
    } finally {
      setAvatarBusy(false);
      e.target.value = '';
    }
  };

  const initials =
    display.firstName && display.lastName
      ? `${display.firstName[0]}${display.lastName[0]}`
      : apiUser?.username?.slice(0, 2).toUpperCase() ?? '?';

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const statRows = [
    { key: 'totalCourses', label: t('totalCourses'), value: display.totalCourses, accent: 'text-slate-900 dark:text-white' },
    { key: 'completedCourses', label: t('completedCourses'), value: display.completedCourses, accent: 'text-blue-600 dark:text-cyan-300' },
    { key: 'totalLessons', label: t('totalLessons'), value: display.totalLessons, accent: 'text-slate-900 dark:text-white' },
    { key: 'completedLessons', label: t('completedLessons'), value: display.completedLessons, accent: 'text-blue-600 dark:text-cyan-300' },
    { key: 'studyTime', label: t('studyTime'), value: display.studyTime, accent: 'text-slate-900 dark:text-white' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B1220] dark:text-slate-100">
      <style>{`
        @keyframes profileGridMove {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-10px,0); }
          100% { transform: translate3d(0,0,0); }
        }
        @keyframes profileGlow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.16),transparent_24%),linear-gradient(180deg,#0B1220_0%,#09101C_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            animation: 'profileGridMove 16s ease-in-out infinite',
          }}
        />
        <div
          className="absolute left-[16%] top-[-5rem] h-80 w-80 rounded-full bg-blue-500/10 blur-[110px] dark:bg-blue-500/18"
          style={{ animation: 'profileGlow 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[8%] right-[10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px] dark:bg-cyan-500/16"
          style={{ animation: 'profileGlow 10s ease-in-out infinite' }}
        />
      </div>

      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full px-3 pb-12 pt-[88px] sm:px-4 sm:pt-[92px] lg:ml-64 lg:w-auto lg:max-w-none lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto w-full max-w-[1680px] space-y-8">
          {/* Hero */}
          <motion.section variants={item}>
            <GlassPanel className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.18),transparent_28%)]" />
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-cyan-400/10 dark:bg-white/[0.04] dark:text-cyan-300/90">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    {hi ? 'प्रोफ़ाइल' : 'Profile'}
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white lg:text-4xl">
                    <span className="bg-gradient-to-r from-slate-950 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-cyan-300">
                      {t('title')}
                    </span>
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 lg:text-base">
                    {hi
                      ? 'अपनी जानकारी, प्राथमिकताएँ और सीखने के आँकड़े — डैशबोर्ड जैसा साफ़, प्रीमियम अनुभव।'
                      : 'Your identity, preferences, and learning snapshot — the same polished experience as your dashboard.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/dashboard`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-300/50 hover:text-blue-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-cyan-300"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {hi ? 'डैशबोर्ड' : 'Dashboard'}
                  </Link>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('editProfile')}
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-full border border-slate-200/90 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
                      >
                        {t('saveChanges')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </GlassPanel>
          </motion.section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main column */}
            <div className="space-y-8 lg:col-span-2">
              <motion.section variants={item}>
                <GlassPanel className="p-6 lg:p-8">
                  <div className="relative z-10">
                    <SectionHeading title={t('personalInfo')} />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>{t('firstName')}</label>
                        {isEditing ? (
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>{t('lastName')}</label>
                        {isEditing ? (
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>{t('email')}</label>
                        {isEditing ? (
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.email}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>{t('phone')}</label>
                        {isEditing ? (
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>{t('dateOfBirth')}</label>
                        {isEditing ? (
                          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.dateOfBirth}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>{t('address')}</label>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className={cn(inputClass, 'resize-y min-h-[88px]')}
                          />
                        ) : (
                          <p className="font-medium leading-relaxed text-slate-900 dark:text-white">{display.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.section>

              <motion.section variants={item}>
                <GlassPanel className="p-6 lg:p-8">
                  <div className="relative z-10">
                    <SectionHeading title={t('academicInfo')} />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>{t('studentId')}</label>
                        <p className="font-medium text-slate-900 dark:text-white">{display.studentId}</p>
                      </div>
                      <div>
                        <label className={labelClass}>{t('enrollmentDate')}</label>
                        <p className="font-medium text-slate-900 dark:text-white">{display.enrollmentDate}</p>
                      </div>
                      <div>
                        <label className={labelClass}>{t('studyYear')}</label>
                        {isEditing ? (
                          <input type="text" name="studyYear" value={formData.studyYear} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.studyYear}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>{t('specialty')}</label>
                        {isEditing ? (
                          <input type="text" name="specialty" value={formData.specialty} onChange={handleInputChange} className={inputClass} />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{display.specialty}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.section>
            </div>

            {/* Sidebar column */}
            <div className="space-y-8">
              <motion.section variants={item}>
                <ParallaxCard className="h-full">
                  <GlassPanel className="p-6 text-center lg:p-8">
                    <div className="relative z-10">
                      <div className="relative mx-auto mb-5 h-36 w-36 overflow-hidden rounded-[28px] shadow-[0_20px_50px_-20px_rgba(59,130,246,0.5)] ring-2 ring-white/40 dark:ring-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 opacity-90" />
                        {profilePhotoUrl && !avatarLoadFailed ? (
                          <Image
                            key={profilePhotoUrl}
                            src={profilePhotoUrl}
                            alt=""
                            fill
                            sizes="144px"
                            className="object-cover"
                            onError={() => setAvatarLoadFailed(true)}
                            priority
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white">
                            {initials}
                          </div>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
                      <button
                        type="button"
                        disabled={avatarBusy}
                        onClick={() => fileRef.current?.click()}
                        className="mb-4 text-sm font-semibold text-blue-600 transition-colors hover:text-cyan-600 disabled:opacity-50 dark:text-cyan-300 dark:hover:text-cyan-200"
                      >
                        {avatarBusy ? (hi ? 'अपलोड…' : 'Uploading…') : hi ? 'फोटो अपलोड करें' : 'Upload photo'}
                      </button>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {display.firstName} {display.lastName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{display.specialty}</p>
                    </div>
                  </GlassPanel>
                </ParallaxCard>
              </motion.section>

              <motion.section variants={item}>
                <GlassPanel className="p-6 lg:p-8">
                  <div className="relative z-10">
                    <SectionHeading title={t('statistics')} />
                    <div className="space-y-3">
                      {statRows.map((row) => (
                        <div
                          key={row.key}
                          className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-400">{row.label}</span>
                          <span className={cn('text-lg font-bold tabular-nums', row.accent)}>{row.value}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-4 dark:from-blue-500/15 dark:to-cyan-500/10">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('averageScore')}</span>
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-2xl font-black text-transparent tabular-nums dark:from-cyan-300 dark:to-blue-400">
                          {display.averageScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
