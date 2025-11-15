import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';

export default async function EditGuidePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: { translations: true }
  });
  if (!guide) notFound();
  const en = guide.translations.find((t) => t.languageCode === 'en');
  const tr = guide.translations.find((t) => t.languageCode === 'tr');

  async function update(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || guide.slug).trim();
    const category = String(formData.get('category') || guide.category).trim();
    const published = formData.get('published') === 'on';
    const enTitle = String(formData.get('en_title') || en?.title || '');
    const enSummary = String(formData.get('en_summary') || en?.summary || '');
    const enContent = String(formData.get('en_content') || en?.content || '');
    const trTitle = String(formData.get('tr_title') || tr?.title || '');
    const trSummary = String(formData.get('tr_summary') || tr?.summary || '');
    const trContent = String(formData.get('tr_content') || tr?.content || '');

    await prisma.guide.update({
      where: { id: guide.id },
      data: {
        slug,
        category,
        published,
        translations: {
          upsert: [
            {
              where: { guideId_languageCode: { guideId: guide.id, languageCode: 'en' } },
              update: { title: enTitle, summary: enSummary, content: enContent },
              create: { languageCode: 'en', title: enTitle, summary: enSummary, content: enContent }
            },
            {
              where: { guideId_languageCode: { guideId: guide.id, languageCode: 'tr' } },
              update: { title: trTitle, summary: trSummary, content: trContent },
              create: { languageCode: 'tr', title: trTitle, summary: trSummary, content: trContent }
            }
          ]
        }
      }
    });
    redirect('/admin/guides');
  }

  async function remove() {
    'use server';
    await prisma.guide.delete({ where: { id: guide.id } });
    redirect('/admin/guides');
  }

  return (
    <form action={update} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Guide #{guide.id}</h1>
        <form action={remove}>
          <button type="submit" className="text-red-600 underline">Delete</button>
        </form>
      </div>
      <section className="space-y-3">
        <TextInput name="slug" label="Slug" defaultValue={guide.slug} />
        <TextInput name="category" label="Category" defaultValue={guide.category} />
        <Checkbox name="published" label="Published" defaultChecked={guide.published} />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <LangFields prefix="en" title="English (EN)" defaults={{ title: en?.title, summary: en?.summary, content: en?.content }} />
        <LangFields prefix="tr" title="Turkish (TR)" defaults={{ title: tr?.title, summary: tr?.summary, content: tr?.content }} />
      </section>
      <button type="submit" className="rounded-md bg-primary-600 text-white px-4 py-2">
        Update
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

function LangFields({ prefix, title, defaults }:{ prefix:'en'|'tr'; title:string; defaults?:{ title?:string; summary?:string; content?:string } }) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <TextInput name={`${prefix}_title`} label="Title" defaultValue={defaults?.title} />
      <TextArea name={`${prefix}_summary`} label="Summary" defaultValue={defaults?.summary} />
      <TextArea name={`${prefix}_content`} label="Content" defaultValue={defaults?.content} />
    </div>
  );
}


