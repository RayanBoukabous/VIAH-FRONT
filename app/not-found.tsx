import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 dark:bg-gray-900 text-center">
      <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">404</h1>
      <p className="text-gray-600 dark:text-gray-400">This page could not be found.</p>
      <Link href="/" className="text-primary font-semibold hover:underline">
        Back to home
      </Link>
    </div>
  );
}
