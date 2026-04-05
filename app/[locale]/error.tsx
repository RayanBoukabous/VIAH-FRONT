'use client';

import { useEffect } from 'react';

/** Avoid next-intl hooks here so this still renders if i18n fails. */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 dark:bg-gray-900 text-center">
      <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{error.message || 'An unexpected error occurred.'}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
