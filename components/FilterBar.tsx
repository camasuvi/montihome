import { useTranslations } from 'next-intl';
import { categories } from '@/lib/i18n';

export default function FilterBar({
  locale,
  initial
}: {
  locale: string;
  initial: {
    age?: string;
    category?: string;
    duration?: string;
    difficulty?: string;
    materials?: string;
  };
}) {
  const t = useTranslations('Activities');

  function buildUrl(form: FormData) {
    const params = new URLSearchParams();
    const age = (form.get('age') as string) || '';
    const category = (form.get('category') as string) || '';
    const duration = (form.get('duration') as string) || '';
    const difficulty = (form.get('difficulty') as string) || '';
    const materials = (form.get('materials') as string) || '';
    if (age) params.set('age', age);
    if (category) params.set('category', category);
    if (duration) params.set('duration', duration);
    if (difficulty) params.set('difficulty', difficulty);
    if (materials) params.set('materials', materials);
    const qs = params.toString();
    return `/${locale}/activities${qs ? `?${qs}` : ''}`;
  }

  return (
    <form
      action={(formData) => {
        'use server';
      }}
      className="grid grid-cols-1 md:grid-cols-5 gap-3"
    >
      <select name="age" defaultValue={initial.age ?? ''} className="border rounded-md h-10 px-2">
        <option value="">{t('ageRange')}</option>
        <option value="AGE_0_6M">0–6m</option>
        <option value="AGE_6_12M">6–12m</option>
        <option value="AGE_12_18M">12–18m</option>
        <option value="AGE_18_24M">18–24m</option>
        <option value="AGE_24_36M">24–36m</option>
        <option value="AGE_3_4Y">3–4y</option>
        <option value="AGE_4_5Y">4–5y</option>
        <option value="AGE_5_6Y">5–6y</option>
        <option value="AGE_6_7Y">6–7y</option>
        <option value="AGE_7_9Y">7–9y</option>
      </select>
      <select
        name="category"
        defaultValue={initial.category ?? ''}
        className="border rounded-md h-10 px-2"
      >
        <option value="">{t('category')}</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        name="duration"
        defaultValue={initial.duration ?? ''}
        className="border rounded-md h-10 px-2"
      >
        <option value="">{t('duration')}</option>
        <option value="short">{t('durationShort')}</option>
        <option value="medium">{t('durationMedium')}</option>
        <option value="long">{t('durationLong')}</option>
      </select>
      <select
        name="difficulty"
        defaultValue={initial.difficulty ?? ''}
        className="border rounded-md h-10 px-2"
      >
        <option value="">{t('difficulty')}</option>
        <option value="EASY">{t('difficultyEasy')}</option>
        <option value="MEDIUM">{t('difficultyMedium')}</option>
        <option value="HARD">{t('difficultyHard')}</option>
      </select>
      <select
        name="materials"
        defaultValue={initial.materials ?? ''}
        className="border rounded-md h-10 px-2"
        onChange={(e) => {
          if (typeof window !== 'undefined') {
            const form = e.currentTarget.form!;
            const url = buildUrl(new FormData(form));
            window.location.href = url;
          }
        }}
      >
        <option value="">{t('materialsLevel')}</option>
        <option value="HOUSEHOLD">{t('materialsHousehold')}</option>
        <option value="SIMPLE_SUPPLIES">{t('materialsSimple')}</option>
        <option value="MONTESSORI">{t('materialsMontessori')}</option>
      </select>
    </form>
  );
}


