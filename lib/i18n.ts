export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe'
};

export function isSupportedLocale(locale: string | undefined | null): locale is Locale {
  return !!locale && (locales as readonly string[]).includes(locale);
}

export function ageRangeLabel(ageRange: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    AGE_0_6M: t('Age.0_6m'),
    AGE_6_12M: t('Age.6_12m'),
    AGE_12_18M: t('Age.12_18m'),
    AGE_18_24M: t('Age.18_24m'),
    AGE_24_36M: t('Age.24_36m'),
    AGE_3_4Y: t('Age.3_4y'),
    AGE_4_5Y: t('Age.4_5y'),
    AGE_5_6Y: t('Age.5_6y'),
    AGE_6_7Y: t('Age.6_7y'),
    AGE_7_9Y: t('Age.7_9y')
  };
  return map[ageRange] ?? ageRange;
}

export const categories = [
  'Practical Life',
  'Sensorial',
  'Language',
  'Math',
  'Culture & Science',
  'Art & Creativity',
  'Movement / Gross Motor'
] as const;

export const tags = [
  'Fine Motor',
  'Concentration',
  'Independence',
  'Order',
  'Social Skills'
] as const;

export const materialsLevels = [
  'HOUSEHOLD',
  'SIMPLE_SUPPLIES',
  'MONTESSORI'
] as const;


