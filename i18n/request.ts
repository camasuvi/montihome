import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './routing';

export default getRequestConfig(async ({locale}) => {
  const isSupported = (locales as readonly string[]).includes(locale);
  const resolved = isSupported ? locale : defaultLocale;
  const messages = (await import(`../messages/${resolved}.json`)).default;
  return {messages};
});


