import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n/routing';

export default createMiddleware({
  locales: Array.from(locales),
  defaultLocale,
  localePrefix
});

export const config = {
  // Skip next internals, static files, API, and admin routes
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|admin).*)'
  ]
};


