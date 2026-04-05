import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  /**
   * Proxy API on the same origin as the Next app so Set-Cookie from login applies to localhost
   * (avoids cross-origin cookie loss with fetch credentials). Configure real backend with API_UPSTREAM.
   */
  async rewrites() {
    const upstream = process.env.API_UPSTREAM ?? 'https://viah.aidaki.ai';
    const base = upstream.replace(/\/+$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${base}/api/v1/:path*`,
      },
    ];
  },
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
    ],
  },
};

export default withNextIntl(nextConfig);
