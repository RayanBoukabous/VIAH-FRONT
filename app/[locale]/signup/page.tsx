'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, signup, getLevels, getSpecialities, type Level, type Speciality } from '@/lib/api';

export default function SignupPage() {
  const t = useTranslations('signup');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(18);
  const [levelId, setLevelId] = useState('');
  const [specialityId, setSpecialityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [levels, setLevels] = useState<Level[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [specialitiesLoading, setSpecialitiesLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLevelsLoading(true);
      setCatalogError(false);
      try {
        const list = await getLevels();
        if (!cancelled) setLevels(list);
      } catch {
        if (!cancelled) {
          setLevels([]);
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

  useEffect(() => {
    if (!levelId) {
      setSpecialities([]);
      setSpecialityId('');
      return;
    }

    let cancelled = false;
    (async () => {
      setSpecialitiesLoading(true);
      setSpecialityId('');
      try {
        const list = await getSpecialities(levelId);
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
  }, [levelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup({
        email,
        username,
        firstName,
        lastName,
        password,
        studentData: {
          age: Number(age),
          levelId,
          specialityId,
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

  const selectClassName =
    'w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <Link
        href={`/${locale}`}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
          {locale === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
        </span>
      </Link>

      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/assets/logo/logo_viah.png"
              alt="VIAH Logo"
              width={180}
              height={60}
              className="h-12 w-auto mx-auto dark:brightness-110"
              priority
            />
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">{t('title')}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {catalogError && (
                <div role="status" className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
                  {t('catalogError')}
                </div>
              )}
              {error && (
                <div role="alert" className="rounded-xl border border-red-200 dark:border-red-400/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('username')}</label>
                <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('firstName')}</label>
                  <input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('lastName')}</label>
                  <input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('age')}</label>
                <input id="age" type="number" min={1} max={120} required value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label htmlFor="levelId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('level')}</label>
                <select
                  id="levelId"
                  required
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                  disabled={levelsLoading}
                  className={selectClassName}
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
                <label htmlFor="specialityId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('speciality')}</label>
                <select
                  id="specialityId"
                  required
                  value={specialityId}
                  onChange={(e) => setSpecialityId(e.target.value)}
                  disabled={!levelId || specialitiesLoading}
                  className={selectClassName}
                >
                  <option value="">
                    {!levelId
                      ? t('selectLevel')
                      : specialitiesLoading
                        ? t('loadingOptions')
                        : t('selectSpeciality')}
                  </option>
                  {specialities.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || levelsLoading || !levelId || !specialityId}
                className="w-full py-4 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-heading font-bold text-lg hover:shadow-xl hover:shadow-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? '…' : t('submit')}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                <Link href={`/${locale}/login`} className="font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light">
                  {t('backToLogin')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
