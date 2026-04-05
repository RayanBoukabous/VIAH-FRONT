'use client';

/**
 * Renders when an error bubbles to the root layout. Must define html/body (no root layout wrapper).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-gray-600 max-w-md text-center">{error.message || 'An unexpected error occurred.'}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-[#3496E2] text-white font-semibold"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
