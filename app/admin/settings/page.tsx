import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  async function toggle() {
    'use server';
    const current = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    await prisma.siteSettings.update({
      where: { id: 1 },
      data: { isPublic: !current?.isPublic }
    });
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded-lg border p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">Public mode</div>
          <div className="text-sm text-gray-600">{settings?.isPublic ? 'On' : 'Off'}</div>
        </div>
        <form action={toggle}>
          <button type="submit" className="rounded-md bg-primary-600 text-white px-4 py-2">
            {settings?.isPublic ? 'Turn Off' : 'Turn On'}
          </button>
        </form>
      </div>
    </div>
  );
}


