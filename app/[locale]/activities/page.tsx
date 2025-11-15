import { prisma } from '@/lib/prisma';
import ActivityCard from '@/components/ActivityCard';
import FilterBar from '@/components/FilterBar';
import EmptyState from '@/components/EmptyState';
import { useTranslations } from 'next-intl';

export default async function ActivitiesPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = params.locale;
  const t = useTranslations('Activities');

  const age = (searchParams.age as string) || '';
  const category = (searchParams.category as string) || '';
  const duration = (searchParams.duration as string) || '';
  const difficulty = (searchParams.difficulty as string) || '';
  const materials = (searchParams.materials as string) || '';

  const where: any = {};
  if (age) where.ageRange = age;
  if (category) where.categories = { has: category };
  if (difficulty) where.difficulty = difficulty;
  if (materials) where.materialsLevel = materials;

  if (duration === 'short') where.durationMinutes = { lte: 10 };
  else if (duration === 'medium') where.durationMinutes = { gt: 10, lte: 20 };
  else if (duration === 'long') where.durationMinutes = { gt: 20 };

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { translations: true }
  });

  const data = activities.map((a) => {
    const translation =
      a.translations.find((t) => t.languageCode === locale) ??
      a.translations.find((t) => t.languageCode === 'en') ??
      null;
    return {
      id: a.id,
      ageRange: a.ageRange,
      primaryCategory: a.primaryCategory,
      durationMinutes: a.durationMinutes,
      difficulty: a.difficulty,
      translation
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
      </div>

      <FilterBar
        locale={locale}
        initial={{ age, category, duration, difficulty, materials }}
      />

      {data.length === 0 ? (
        <EmptyState title={t('noResults')} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((a) => (
            <ActivityCard key={a.id} locale={locale} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}


