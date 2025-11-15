import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';

export default async function EditActivityPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!activity) notFound();

  const en = activity.translations.find((t) => t.languageCode === 'en');
  const tr = activity.translations.find((t) => t.languageCode === 'tr');

  async function update(formData: FormData) {
    'use server';
    const ageRange = String(formData.get('ageRange') || activity.ageRange);
    const durationMinutes = Number(formData.get('durationMinutes') || activity.durationMinutes);
    const difficulty = String(formData.get('difficulty') || activity.difficulty);
    const primaryCategory = String(formData.get('primaryCategory') || activity.primaryCategory);
    const categories = String(formData.get('categories') || activity.categories.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
    const tags = String(formData.get('tags') || activity.tags.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
    const materialsLevel = String(formData.get('materialsLevel') || activity.materialsLevel || 'HOUSEHOLD');

    const enTitle = String(formData.get('en_title') || en?.title || '');
    const enShort = String(formData.get('en_short') || en?.shortDescription || '');
    const enDesc = String(formData.get('en_desc') || en?.description || '');
    const enMaterials = String(formData.get('en_materials') || JSON.stringify(en?.materials ?? []));
    const enSteps = String(formData.get('en_steps') || JSON.stringify(en?.steps ?? []));
    const enGoal = String(formData.get('en_goal') || en?.goal || '');
    const enTips = String(formData.get('en_tips') || JSON.stringify(en?.tips ?? []));
    const enVars = String(formData.get('en_vars') || JSON.stringify(en?.variations ?? []));
    const enSafety = String(formData.get('en_safety') || en?.safetyNotes || '');

    const trTitle = String(formData.get('tr_title') || tr?.title || '');
    const trShort = String(formData.get('tr_short') || tr?.shortDescription || '');
    const trDesc = String(formData.get('tr_desc') || tr?.description || '');
    const trMaterials = String(formData.get('tr_materials') || JSON.stringify(tr?.materials ?? []));
    const trSteps = String(formData.get('tr_steps') || JSON.stringify(tr?.steps ?? []));
    const trGoal = String(formData.get('tr_goal') || tr?.goal || '');
    const trTips = String(formData.get('tr_tips') || JSON.stringify(tr?.tips ?? []));
    const trVars = String(formData.get('tr_vars') || JSON.stringify(tr?.variations ?? []));
    const trSafety = String(formData.get('tr_safety') || tr?.safetyNotes || '');

    await prisma.activity.update({
      where: { id: activity.id },
      data: {
        ageRange,
        durationMinutes,
        difficulty,
        primaryCategory,
        categories,
        tags,
        materialsLevel,
        translations: {
          upsert: [
            {
              where: { activityId_languageCode: { activityId: activity.id, languageCode: 'en' } },
              update: {
                title: enTitle,
                shortDescription: enShort,
                description: enDesc,
                materials: safeJson(enMaterials),
                steps: safeJson(enSteps),
                goal: enGoal,
                tips: safeJson(enTips),
                variations: safeJson(enVars),
                safetyNotes: enSafety
              },
              create: {
                languageCode: 'en',
                title: enTitle,
                shortDescription: enShort,
                description: enDesc,
                materials: safeJson(enMaterials),
                steps: safeJson(enSteps),
                goal: enGoal,
                tips: safeJson(enTips),
                variations: safeJson(enVars),
                safetyNotes: enSafety
              }
            },
            {
              where: { activityId_languageCode: { activityId: activity.id, languageCode: 'tr' } },
              update: {
                title: trTitle,
                shortDescription: trShort,
                description: trDesc,
                materials: safeJson(trMaterials),
                steps: safeJson(trSteps),
                goal: trGoal,
                tips: safeJson(trTips),
                variations: safeJson(trVars),
                safetyNotes: trSafety
              },
              create: {
                languageCode: 'tr',
                title: trTitle,
                shortDescription: trShort,
                description: trDesc,
                materials: safeJson(trMaterials),
                steps: safeJson(trSteps),
                goal: trGoal,
                tips: safeJson(trTips),
                variations: safeJson(trVars),
                safetyNotes: trSafety
              }
            }
          ]
        }
      }
    });
    redirect('/admin/activities');
  }

  async function remove() {
    'use server';
    await prisma.activity.delete({ where: { id: activity.id } });
    redirect('/admin/activities');
  }

  return (
    <form action={update} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Activity #{activity.id}</h1>
        <form action={remove}>
          <button type="submit" className="text-red-600 underline">Delete</button>
        </form>
      </div>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="font-semibold">Base</h2>
          <Select name="ageRange" label="Age Range" options={ageOptions} defaultValue={activity.ageRange} />
          <NumberInput name="durationMinutes" label="Duration (minutes)" defaultValue={activity.durationMinutes} />
          <Select name="difficulty" label="Difficulty" options={['EASY','MEDIUM','HARD']} defaultValue={activity.difficulty} />
          <TextInput name="primaryCategory" label="Primary Category" defaultValue={activity.primaryCategory} />
          <TextInput name="categories" label="Categories (comma-separated)" defaultValue={activity.categories.join(', ')} />
          <TextInput name="tags" label="Tags (comma-separated)" defaultValue={activity.tags.join(', ')} />
          <Select name="materialsLevel" label="Materials Level" options={['HOUSEHOLD','SIMPLE_SUPPLIES','MONTESSORI']} defaultValue={activity.materialsLevel || 'HOUSEHOLD'} />
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">English (EN)</h2>
          <TextInput name="en_title" label="Title" defaultValue={en?.title || ''} />
          <TextArea name="en_short" label="Short Description" defaultValue={en?.shortDescription || ''} />
          <TextArea name="en_desc" label="Description" defaultValue={en?.description || ''} />
          <TextArea name="en_materials" label="Materials (JSON array)" defaultValue={JSON.stringify(en?.materials ?? [])} />
          <TextArea name="en_steps" label="Steps (JSON array)" defaultValue={JSON.stringify(en?.steps ?? [])} />
          <TextArea name="en_goal" label="Goal" defaultValue={en?.goal || ''} />
          <TextArea name="en_tips" label="Tips (JSON array)" defaultValue={JSON.stringify(en?.tips ?? [])} />
          <TextArea name="en_vars" label="Variations (JSON array)" defaultValue={JSON.stringify(en?.variations ?? [])} />
          <TextArea name="en_safety" label="Safety Notes" defaultValue={en?.safetyNotes || ''} />
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Turkish (TR)</h2>
        <TextInput name="tr_title" label="Title" defaultValue={tr?.title || ''} />
        <TextArea name="tr_short" label="Short Description" defaultValue={tr?.shortDescription || ''} />
        <TextArea name="tr_desc" label="Description" defaultValue={tr?.description || ''} />
        <TextArea name="tr_materials" label="Materials (JSON array)" defaultValue={JSON.stringify(tr?.materials ?? [])} />
        <TextArea name="tr_steps" label="Steps (JSON array)" defaultValue={JSON.stringify(tr?.steps ?? [])} />
        <TextArea name="tr_goal" label="Goal" defaultValue={tr?.goal || ''} />
        <TextArea name="tr_tips" label="Tips (JSON array)" defaultValue={JSON.stringify(tr?.tips ?? [])} />
        <TextArea name="tr_vars" label="Variations (JSON array)" defaultValue={JSON.stringify(tr?.variations ?? [])} />
        <TextArea name="tr_safety" label="Safety Notes" defaultValue={tr?.safetyNotes || ''} />
      </section>
      <button type="submit" className="rounded-md bg-primary-600 text-white px-4 py-2">Update</button>
    </form>
  );
}

function safeJson(input: string): any {
  try { return JSON.parse(input); } catch { return undefined; }
}

function TextInput({ name, label, defaultValue }:{ name:string; label:string; defaultValue?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} className="border rounded-md h-10 px-3 w-full" />
    </div>
  );
}

function NumberInput({ name, label, defaultValue }:{ name:string; label:string; defaultValue?:number }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <input id={name} name={name} type="number" defaultValue={defaultValue} className="border rounded-md h-10 px-3 w-full" />
    </div>
  );
}

function TextArea({ name, label, defaultValue }:{ name:string; label:string; defaultValue?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue} className="border rounded-md min-h-[80px] px-3 py-2 w-full" />
    </div>
  );
}

const ageOptions = ['AGE_0_6M','AGE_6_12M','AGE_12_18M','AGE_18_24M','AGE_24_36M','AGE_3_4Y','AGE_4_5Y','AGE_5_6Y','AGE_6_7Y','AGE_7_9Y'];

function Select({ name, label, options, defaultValue }:{ name:string; label:string; options:string[]; defaultValue?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} className="border rounded-md h-10 px-3 w-full">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}


