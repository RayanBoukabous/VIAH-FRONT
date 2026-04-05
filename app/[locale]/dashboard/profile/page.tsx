'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getMe, uploadProfileImage, type AuthUser } from '@/lib/api';

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
  const [isEditing, setIsEditing] = useState(false);
  const [apiUser, setApiUser] = useState<AuthUser | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
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
    let cancelled = false;
    (async () => {
      try {
        const user = await getMe();
        if (!cancelled) {
          setApiUser(user);
          setFormData(formFromUser(user, mockExtras));
          setLoadError(false);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = formData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />
      
      <main className="ml-64 pt-60 pb-6 p-4 lg:p-6 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          {loadError && (
            <div className="mb-6 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              {locale === 'hi'
                ? 'प्रोफ़ाइल API से लोड नहीं हो सकी।'
                : 'Could not load profile from the API.'}
            </div>
          )}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 pt-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {t('title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your profile information and preferences
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-heading font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('editProfile')}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-heading font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-heading font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
                  >
                    {t('saveChanges')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal & Academic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                  {t('personalInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('firstName')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('lastName')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('email')}
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('phone')}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('dateOfBirth')}
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.dateOfBirth}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('address')}
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                  {t('academicInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('studentId')}
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{display.studentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('enrollmentDate')}
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{display.enrollmentDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('studyYear')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="studyYear"
                        value={formData.studyYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.studyYear}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('specialty')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{display.specialty}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="space-y-6">
              {/* Profile Avatar */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {initials}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
                <button
                  type="button"
                  disabled={avatarBusy}
                  onClick={() => fileRef.current?.click()}
                  className="mb-4 text-sm font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light disabled:opacity-50"
                >
                  {avatarBusy
                    ? locale === 'hi'
                      ? 'अपलोड…'
                      : 'Uploading…'
                    : locale === 'hi'
                      ? 'फोटो अपलोड करें'
                      : 'Upload photo'}
                </button>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                  {display.firstName} {display.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{display.specialty}</p>
              </div>

              {/* Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                  {t('statistics')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('totalCourses')}</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{display.totalCourses}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('completedCourses')}</span>
                    <span className="text-lg font-bold text-primary dark:text-primary-light">{display.completedCourses}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('totalLessons')}</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{display.totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('completedLessons')}</span>
                    <span className="text-lg font-bold text-primary dark:text-primary-light">{display.completedLessons}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('studyTime')}</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{display.studyTime}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary-dark/10 dark:from-primary/20 dark:to-primary-dark/20 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('averageScore')}</span>
                    <span className="text-2xl font-bold text-primary dark:text-primary-light">{display.averageScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
