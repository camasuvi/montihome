import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminGuidesList() {
  const guides = await prisma.guide.findMany({
    orderBy: { createdAt: 'desc' },
    include: { translations: true }
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Guides</h1>
        <Link
          className="rounded-md bg-primary-600 text-white px-4 py-2 hover:bg-primary-700"
          href="/admin/guides/new"
        >
          Create Guide
        </Link>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="px-3 py-2">{g.id}</td>
                <td className="px-3 py-2">{g.slug}</td>
                <td className="px-3 py-2">{g.category}</td>
                <td className="px-3 py-2">{g.published ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2 text-right">
                  <Link className="text-primary-700 underline" href={`/admin/guides/${g.id}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


