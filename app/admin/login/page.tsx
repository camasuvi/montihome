import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

function getHash(secret: string): string {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export default function AdminLoginPage() {
  async function signIn(formData: FormData) {
    'use server';
    const password = String(formData.get('password') || '');
    const expected = process.env.ADMIN_PASSWORD || '';
    if (password && expected && password === expected) {
      const value = getHash(expected);
      cookies().set('admin_auth', value, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      });
      redirect('/admin');
    }
    // If failed, redirect back
    redirect('/admin/login?error=1');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form action={signIn} className="border rounded-lg p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <div className="space-y-2">
          <label className="text-sm text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="border rounded-md h-10 px-3 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full h-10 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}


