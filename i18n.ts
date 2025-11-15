import {getRequestConfig} from 'next-intl/server';
import {locales} from './i18n/routing';

export default getRequestConfig(async ({locale}) => {
  const isSupported = (locales as readonly string[]).includes(locale);
  const resolved = isSupported ? locale : 'en';
  const messages = (await import(`./messages/${resolved}.json`)).default;
  return {messages};
});


