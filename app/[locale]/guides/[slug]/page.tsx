import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function GuideDetail({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const guide = await prisma.guide.findUnique({
    where: { slug },
    include: { translations: true }
  });
  if (!guide || !guide.published) {
    notFound();
  }
  const tr =
    guide.translations.find((x) => x.languageCode === locale) ??
    guide.translations.find((x) => x.languageCode === 'en') ??
    null;
  if (!tr) {
    notFound();
  }
  return (
    <article className="prose max-w-3xl">
      <h1>{tr.title}</h1>
      <p className="text-gray-600">{tr.summary}</p>
      <div className="mt-6 whitespace-pre-wrap">{tr.content}</div>
    </article>
  );
}


