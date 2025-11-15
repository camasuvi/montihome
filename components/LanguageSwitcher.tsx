'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeLabels } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function onChange(nextLocale: string) {
    if (!pathname) return;
    const segments = pathname.split('/');
    // segments: ['', locale, ...]
    if (segments.length > 1) {
      segments[1] = nextLocale;
      router.push(segments.join('/'));
    }
  }

  return (
    <select
      aria-label="Language"
      className="border border-gray-300 rounded-md h-9 px-2 bg-white"
      value={locale}
      onChange={(e) => onChange(e.target.value)}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}


