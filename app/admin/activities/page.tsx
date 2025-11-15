import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminActivitiesList() {
  'use server';
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { translations: true }
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Activities</h1>
        <Link
          className="rounded-md bg-primary-600 text-white px-4 py-2 hover:bg-primary-700"
          href="/admin/activities/new"
        >
          Create Activity
        </Link>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Title (EN)</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => {
              const en = a.translations.find((t) => t.languageCode === 'en');
              return (
                <tr key={a.id} className="border-t">
                  <td className="px-3 py-2">{a.id}</td>
                  <td className="px-3 py-2">{en?.title ?? '(no title)'}</td>
                  <td className="px-3 py-2">{a.ageRange}</td>
                  <td className="px-3 py-2">{a.primaryCategory}</td>
                  <td className="px-3 py-2 text-right">
                    <Link className="text-primary-700 underline" href={`/admin/activities/${a.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


