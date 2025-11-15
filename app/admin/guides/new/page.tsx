import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default function NewGuidePage() {
  async function create(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const published = formData.get('published') === 'on';
    const enTitle = String(formData.get('en_title') || '');
    const enSummary = String(formData.get('en_summary') || '');
    const enContent = String(formData.get('en_content') || '');
    const trTitle = String(formData.get('tr_title') || '');
    const trSummary = String(formData.get('tr_summary') || '');
    const trContent = String(formData.get('tr_content') || '');
    const created = await prisma.guide.create({
      data: {
        slug,
        category,
        published,
        translations: {
          create: [
            { languageCode: 'en', title: enTitle, summary: enSummary, content: enContent },
            { languageCode: 'tr', title: trTitle, summary: trSummary, content: trContent }
          ]
        }
      }
    });
    redirect(`/admin/guides/${created.id}`);
  }

  return (
    <form action={create} className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Guide</h1>
      <section className="space-y-3">
        <TextInput name="slug" label="Slug" />
        <TextInput name="category" label="Category" />
        <Checkbox name="published" label="Published" />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <LangFields prefix="en" title="English (EN)" />
        <LangFields prefix="tr" title="Turkish (TR)" />
      </section>
      <button type="submit" className="rounded-md bg-primary-600 text-white px-4 py-2">
        Create
      </button>
    </form>
  );
}

function TextInput({ name, label, defaultValue }:{ name:string; label:string; defaultValue?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} className="border rounded-md h-10 px-3 w-full" />
    </div>
  );
}

function TextArea({ name, label, defaultValue }:{ name:string; label:string; defaultValue?:string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue} className="border rounded-md min-h-[120px] px-3 py-2 w-full" />
    </div>
  );
}

function Checkbox({ name, label, defaultChecked }:{ name:string; label:string; defaultChecked?:boolean }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}

function LangFields({ prefix, title }:{ prefix:'en'|'tr'; title:string }) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <TextInput name={`${prefix}_title`} label="Title" />
      <TextArea name={`${prefix}_summary`} label="Summary" />
      <TextArea name={`${prefix}_content`} label="Content" />
    </div>
  );
}


