import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Nav({ locale }: { locale: string }) {
  const t = useTranslations('Nav');
  return (
    <header className="border-b border-gray-200">
      <div className="container-responsive flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="text-lg font-semibold">
          MontiHome
        </Link>
        <nav className="flex items-center gap-6">
          <Link href={`/${locale}/activities`} className="hover:text-primary-700">
            {t('activities')}
          </Link>
          <Link href={`/${locale}/guides`} className="hover:text-primary-700">
            {t('guides')}
          </Link>
          <Link href={`/${locale}/my-plan`} className="hover:text-primary-700">
            {t('myPlan')}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-primary-700">
            {t('about')}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}


