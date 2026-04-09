import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  /** Tree-shake icon imports for smaller client chunks & faster navigations. */
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
  },
  /** Avoid stale / missing vendor chunks for next-intl → @formatjs in dev (delete `.next` if error persists). */
  transpilePackages: ['next-intl'],
  /** API: see `app/api/v1/[...path]/route.ts` — forwards cookies to API_UPSTREAM. */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'viah.aidaki.ai',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
