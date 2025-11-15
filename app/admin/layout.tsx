import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import Link from 'next/link';

function getHash(secret: string): string {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const cookie = cookies().get('admin_auth')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const expected = adminPassword ? getHash(adminPassword) : '';
  if (!cookie || !expected || cookie !== expected) {
    redirect('/admin/login');
  }
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200">
        <div className="container-responsive h-14 flex items-center justify-between">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/activities">Activities</Link>
            <Link href="/admin/guides">Guides</Link>
            <Link href="/admin/settings">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="container-responsive py-6">{children}</main>
    </div>
  );
}


