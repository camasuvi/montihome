import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AgeRange, Difficulty, MaterialsLevel } from '@prisma/client';

export default function NewActivityPage() {
  async function create(formData: FormData) {
    'use server';
    const ageRangeInput = String(formData.get('ageRange') || 'AGE_3_4Y');
    const durationMinutes = Number(formData.get('durationMinutes') || 10);
    const difficultyInput = String(formData.get('difficulty') || 'EASY');
    const primaryCategory = String(formData.get('primaryCategory') || 'Practical Life');
    const categories = String(formData.get('categories') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const tags = String(formData.get('tags') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const materialsLevelInput = String(formData.get('materialsLevel') || 'HOUSEHOLD');

    const ageRange: AgeRange = (Object.values(AgeRange) as string[]).includes(ageRangeInput)
      ? (ageRangeInput as AgeRange)
      : AgeRange.AGE_3_4Y;
    const difficulty: Difficulty = (Object.values(Difficulty) as string[]).includes(difficultyInput)
      ? (difficultyInput as Difficulty)
      : Difficulty.EASY;
    const materialsLevel: MaterialsLevel = (Object.values(MaterialsLevel) as string[]).includes(materialsLevelInput)
      ? (materialsLevelInput as MaterialsLevel)
      : MaterialsLevel.HOUSEHOLD;

    const enTitle = String(formData.get('en_title') || '');
    const enShort = String(formData.get('en_short') || '');
    const enDesc = String(formData.get('en_desc') || '');
    const enMaterials = String(formData.get('en_materials') || '[]');
    const enSteps = String(formData.get('en_steps') || '[]');
    const enGoal = String(formData.get('en_goal') || '');
    const enTips = String(formData.get('en_tips') || '[]');
    const enVars = String(formData.get('en_vars') || '[]');
    const enSafety = String(formData.get('en_safety') || '');

    const trTitle = String(formData.get('tr_title') || '');
    const trShort = String(formData.get('tr_short') || '');
    const trDesc = String(formData.get('tr_desc') || '');
    const trMaterials = String(formData.get('tr_materials') || '[]');
    const trSteps = String(formData.get('tr_steps') || '[]');
    const trGoal = String(formData.get('tr_goal') || '');
    const trTips = String(formData.get('tr_tips') || '[]');
    const trVars = String(formData.get('tr_vars') || '[]');
    const trSafety = String(formData.get('tr_safety') || '');

    const created = await prisma.activity.create({
      data: {
        ageRange,
        durationMinutes,
        difficulty,
        primaryCategory,
        categories,
        tags,
        materialsLevel,
        translations: {
          create: [
            {
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
            },
            {
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
          ]
        }
      }
    });
    redirect(`/admin/activities/${created.id}`);
  }

  return (
    <form action={create} className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Activity</h1>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="font-semibold">Base</h2>
          <Select name="ageRange" label="Age Range" options={ageOptions} />
          <NumberInput name="durationMinutes" label="Duration (minutes)" defaultValue={10} />
          <Select name="difficulty" label="Difficulty" options={['EASY','MEDIUM','HARD']} />
          <TextInput name="primaryCategory" label="Primary Category" defaultValue="Practical Life" />
          <TextInput name="categories" label="Categories (comma-separated)" placeholder="Practical Life, Sensorial" />
          <TextInput name="tags" label="Tags (comma-separated)" placeholder="Fine Motor, Concentration" />
          <Select name="materialsLevel" label="Materials Level" options={['HOUSEHOLD','SIMPLE_SUPPLIES','MONTESSORI']} />
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">English (EN)</h2>
          <TextInput name="en_title" label="Title" />
          <TextArea name="en_short" label="Short Description" />
          <TextArea name="en_desc" label="Description" />
          <TextArea name="en_materials" label="Materials (JSON array)" placeholder='["item1","item2"]' />
          <TextArea name="en_steps" label="Steps (JSON array)" placeholder='["step1","step2"]' />
          <TextArea name="en_goal" label="Goal" />
          <TextArea name="en_tips" label="Tips (JSON array)" placeholder='["tip1","tip2"]' />
          <TextArea name="en_vars" label="Variations (JSON array)" placeholder='["var1","var2"]' />
          <TextArea name="en_safety" label="Safety Notes" />
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Turkish (TR)</h2>
        <TextInput name="tr_title" label="Title" />
        <TextArea name="tr_short" label="Short Description" />
        <TextArea name="tr_desc" label="Description" />
        <TextArea name="tr_materials" label="Materials (JSON array)" />
        <TextArea name="tr_steps" label="Steps (JSON array)" />
        <TextArea name="tr_goal" label="Goal" />
        <TextArea name="tr_tips" label="Tips (JSON array)" />
        <TextArea name="tr_vars" label="Variations (JSON array)" />
        <TextArea name="tr_safety" label="Safety Notes" />
      </section>
      <button type="submit" className="rounded-md bg-primary-600 text-white px-4 py-2">Create</button>
    </form>
  );
}

function safeJson(input: string): any {
  try { return JSON.parse(input); } catch { return undefined; }
}

function TextInput({ name, label, defaultValue, placeholder }:{ name:string; label:string; defaultValue?:string; placeholder?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} className="border rounded-md h-10 px-3 w-full" />
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

function TextArea({ name, label, placeholder }:{ name:string; label:string; placeholder?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} placeholder={placeholder} className="border rounded-md min-h-[80px] px-3 py-2 w-full" />
    </div>
  );
}

const ageOptions = ['AGE_0_6M','AGE_6_12M','AGE_12_18M','AGE_18_24M','AGE_24_36M','AGE_3_4Y','AGE_4_5Y','AGE_5_6Y','AGE_6_7Y','AGE_7_9Y'];

function Select({ name, label, options }:{ name:string; label:string; options:string[] }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <select id={name} name={name} className="border rounded-md h-10 px-3 w-full">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}


