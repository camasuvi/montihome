import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { prisma } from '@/lib/prisma';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { isSupportedLocale, Locale } from '@/lib/i18n';

export default async function LocaleLayout({
  params,
  children
}: {
  params: { locale: string };
  children: ReactNode;
}) {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : 'en';
  const messages =
    locale === 'tr'
      ? (await import('@/messages/tr.json')).default
      : (await import('@/messages/en.json')).default;

  // Site visibility check
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const isPublic = settings?.isPublic ?? false;

  if (!isPublic) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Nav locale={locale} />
        <main className="container-responsive py-12">
          <div className="h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-semibold">Private / Coming soon</h1>
              <p className="text-gray-600 mt-2">
                Site is not public yet. Please check back later.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Nav locale={locale} />
      <main className="container-responsive py-8">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}


