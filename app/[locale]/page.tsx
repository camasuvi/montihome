import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { locales } from '@/lib/i18n';

export default function Landing({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  // useTranslations is not available in server components directly without hook wrapper,
  // but next-intl supports calling in Server Components.
  const t = useTranslations('Landing');
  return (
    <div className="space-y-12">
      <section className="py-10 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">{t('heroTitle')}</h1>
          <p className="mt-4 text-lg text-gray-700">{t('heroSubtitle')}</p>
          <div className="mt-6">
            <Link
              href={`/${locale}/activities`}
              className="inline-flex items-center rounded-md bg-primary-600 text-white px-5 py-3 font-medium hover:bg-primary-700"
            >
              {t('exploreActivities')}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <AgeButton locale={locale} age="AGE_0_6M" label="0–6m" />
        <AgeButton locale={locale} age="AGE_6_12M" label="6–12m" />
        <AgeButton locale={locale} age="AGE_12_18M" label="12–18m" />
        <AgeButton locale={locale} age="AGE_18_24M" label="18–24m" />
        <AgeButton locale={locale} age="AGE_24_36M" label="2–3y" />
        <AgeButton locale={locale} age="AGE_3_4Y" label="3–4y" />
        <AgeButton locale={locale} age="AGE_4_5Y" label="4–5y" />
        <AgeButton locale={locale} age="AGE_5_6Y" label="5–6y" />
        <AgeButton locale={locale} age="AGE_6_7Y" label="6–7y" />
        <AgeButton locale={locale} age="AGE_7_9Y" label="7–9y" />
      </section>

      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-semibold">{t('whatIsMontessoriTitle')}</h2>
          <p className="text-gray-700 mt-3">{t('whatIsMontessoriText')}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium">{t('guidesTeaser')}</h3>
          <p className="text-gray-700 mt-2">
            {/* Keep text minimal; details in guide pages */}
          </p>
          <Link href={`/${locale}/guides`} className="text-primary-700 underline mt-3 inline-block">
            {t('guidesTeaser')}
          </Link>
        </div>
      </section>
    </div>
  );
}

function AgeButton({ locale, age, label }: { locale: string; age: string; label: string }) {
  return (
    <Link
      href={`/${locale}/activities?age=${encodeURIComponent(age)}`}
      className="border rounded-md px-3 py-2 text-center hover:bg-gray-50"
    >
      {label}
    </Link>
  );
}


