'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import { useTranslations } from 'next-intl';

type Item = {
  id: number;
  title: string;
  ageRange: string;
  primaryCategory: string;
};

export default function MyPlanPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const t = useTranslations('MyPlan');
  const [items, setItems] = useState<Item[]>([]);

  function load() {
    try {
      const raw = localStorage.getItem('planActivityIds');
      const ids: number[] = raw ? JSON.parse(raw) : [];
      if (ids.length === 0) {
        setItems([]);
        return;
      }
      fetch(`/api/activities?ids=${ids.join(',')}&locale=${locale}`)
        .then((r) => r.json())
        .then((data) => setItems(data))
        // eslint-disable-next-line no-empty
        .catch(() => {});
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    load();
  }, [locale]);

  function remove(id: number) {
    try {
      const raw = localStorage.getItem('planActivityIds');
      const ids: number[] = raw ? JSON.parse(raw) : [];
      const next = ids.filter((x) => x !== id);
      localStorage.setItem('planActivityIds', JSON.stringify(next));
      load();
    } catch {
      // ignore
    }
  }

  function clearAll() {
    localStorage.removeItem('planActivityIds');
    setItems([]);
  }

  if (items.length === 0) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <button onClick={clearAll} className="text-sm underline text-red-600">
          {t('clearAll')}
        </button>
      </div>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {items.map((it) => (
          <li key={it.id} className="p-4 flex items-center justify-between">
            <div>
              <Link
                className="font-medium hover:underline"
                href={`/${locale}/activities/${it.id}`}
              >
                {it.title}
              </Link>
              <div className="text-sm text-gray-600">
                {it.primaryCategory} • {it.ageRange}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => remove(it.id)} className="text-sm text-red-600 underline">
                {t('remove')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


