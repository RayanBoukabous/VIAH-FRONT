'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getMe } from '@/lib/api';

export default function DashboardAuthGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await getMe();
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) {
          router.replace(`/${locale}/login`);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          {locale === 'hi' ? 'लोड हो रहा है…' : 'Loading…'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
