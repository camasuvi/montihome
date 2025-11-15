import { prisma } from '@/lib/prisma';
import { ageRangeLabel } from '@/lib/i18n';
import { useTranslations } from 'next-intl';

export default async function ActivityDetail({
  params
}: {
  params: { locale: string; id: string };
}) {
  const locale = params.locale;
  const id = Number(params.id);
  const t = useTranslations();

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!activity) {
    return <div>Not found</div>;
  }
  const tr =
    activity.translations.find((x) => x.languageCode === locale) ??
    activity.translations.find((x) => x.languageCode === 'en') ??
    null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1">
          {ageRangeLabel(activity.ageRange, (k) => t(k))}
        </span>
        <span>•</span>
        <span>{activity.primaryCategory}</span>
        <span>•</span>
        <span>
          {t('Activity.duration')}: {activity.durationMinutes} {t('Activity.minutes')}
        </span>
        <span>•</span>
        <span>
          {t('Activity.difficulty')}: {activity.difficulty}
        </span>
      </div>
      <h1 className="text-3xl font-bold mt-4">{tr?.title ?? 'Untitled'}</h1>
      {tr?.goal ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t('Activity.goal')}</h2>
          <p className="text-gray-700 mt-2 whitespace-pre-line">{tr.goal}</p>
        </section>
      ) : null}
      {tr?.materials ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t('Activity.materials')}</h2>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(tr.materials as any[]).map((m, i) => (
              <li key={i}>{String(m)}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {tr?.steps ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t('Activity.steps')}</h2>
          <ol className="list-decimal pl-6 mt-2 text-gray-700 space-y-1">
            {(tr.steps as any[]).map((s, i) => (
              <li key={i}>{String(s)}</li>
            ))}
          </ol>
        </section>
      ) : null}
      {tr?.tips ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t('Activity.tips')}</h2>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(tr.tips as any[]).map((m, i) => (
              <li key={i}>{String(m)}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {tr?.variations ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t('Activity.variations')}</h2>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(tr.variations as any[]).map((m, i) => (
              <li key={i}>{String(m)}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {tr?.safetyNotes ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t('Activity.safety')}</h2>
          <p className="text-gray-700 mt-2 whitespace-pre-line">{tr.safetyNotes}</p>
        </section>
      ) : null}
    </div>
  );
}


