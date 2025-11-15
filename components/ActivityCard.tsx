import Link from 'next/link';
import { Card } from './Card';
import { Button } from './Button';
import { useTranslations } from 'next-intl';
import { ageRangeLabel } from '@/lib/i18n';

type Translation = {
  title: string;
  shortDescription?: string | null;
};

export default function ActivityCard({
  locale,
  activity
}: {
  locale: string;
  activity: {
    id: number;
    ageRange: string;
    primaryCategory: string;
    durationMinutes: number;
    difficulty: string;
    translation: Translation | null;
  };
}) {
  const t = useTranslations();
  const title = activity.translation?.title ?? 'Untitled';
  const shortDesc = activity.translation?.shortDescription ?? '';
  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs">
          {ageRangeLabel(activity.ageRange, t)}
        </span>
        <span className="text-xs text-gray-600">{activity.primaryCategory}</span>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {shortDesc ? <p className="text-sm text-gray-700">{shortDesc}</p> : null}
      <div className="mt-auto flex items-center justify-between text-xs text-gray-600">
        <span>
          {t('Activity.duration')}: {activity.durationMinutes} {t('Activity.minutes')}
        </span>
        <span>
          {t('Activity.difficulty')}: {activity.difficulty}
        </span>
      </div>
      <div className="pt-2 flex gap-2">
        <Link href={`/${locale}/activities/${activity.id}`} className="flex-1">
          <Button className="w-full" variant="secondary">
            {t('Activities.viewDetails')}
          </Button>
        </Link>
        <Button
          className="flex-1"
          onClick={() => {
            try {
              const key = 'planActivityIds';
              const raw = localStorage.getItem(key);
              const ids: number[] = raw ? JSON.parse(raw) : [];
              if (!ids.includes(activity.id)) {
                ids.push(activity.id);
                localStorage.setItem(key, JSON.stringify(ids));
              }
              // eslint-disable-next-line no-empty
            } catch {}
          }}
        >
          {t('Activities.addToPlan')}
        </Button>
      </div>
    </Card>
  );
}


