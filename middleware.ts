import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

/** Backend OAuth redirects to `/profile`; map to the localized dashboard profile route. */
export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/profile') {
    return NextResponse.redirect(new URL('/dashboard/profile', request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
