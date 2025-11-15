import {createMiddleware} from 'next-intl/middleware';

export const locales = ['en', 'tr'] as const;
export const defaultLocale = 'en';
export const localePrefix = 'always' as const;

// Re-export a middleware factory in case consumers want to import from here.
export const intlMiddleware = createMiddleware({
  locales: Array.from(locales),
  defaultLocale,
  localePrefix
});


