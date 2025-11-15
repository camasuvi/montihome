import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get('ids') || '';
  const locale = searchParams.get('locale') || 'en';
  const ids = idsParam
    .split(',')
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  if (ids.length === 0) {
    return NextResponse.json([]);
  }
  const activities = await prisma.activity.findMany({
    where: { id: { in: ids } },
    include: { translations: true }
  });
  const items = activities.map((a) => {
    const tr =
      a.translations.find((x) => x.languageCode === locale) ??
      a.translations.find((x) => x.languageCode === 'en') ??
      null;
    return {
      id: a.id,
      title: tr?.title ?? 'Untitled',
      ageRange: a.ageRange,
      primaryCategory: a.primaryCategory
    };
  });
  return NextResponse.json(items);
}


