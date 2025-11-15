import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  locales: Array.from(locales),
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Skip next internals, static files, API, and admin routes
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|admin(/.*)?).*)'
  ]
};


