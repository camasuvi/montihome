import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card } from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { useTranslations } from 'next-intl';

export default async function GuidesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const t = useTranslations('Guides');
  const guides = await prisma.guide.findMany({
    where: { published: true },
    include: { translations: true },
    orderBy: { createdAt: 'desc' }
  });

  const items = guides.map((g) => {
    const tr =
      g.translations.find((x) => x.languageCode === locale) ??
      g.translations.find((x) => x.languageCode === 'en') ??
      null;
    return { ...g, tr };
  });

  if (items.length === 0) {
    return <EmptyState title={t('noGuides')} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((g) => (
          <Card key={g.id} className="p-4">
            <div className="text-xs text-gray-600">{g.category}</div>
            <h3 className="text-lg font-semibold mt-1">{g.tr?.title ?? g.slug}</h3>
            {g.tr?.summary ? (
              <p className="text-gray-700 text-sm mt-2 line-clamp-3">{g.tr.summary}</p>
            ) : null}
            <Link
              href={`/${locale}/guides/${g.slug}`}
              className="text-primary-700 underline mt-3 inline-block"
            >
              {t('readMore')}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}


