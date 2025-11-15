import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MontiHome',
  description: 'Montessori-inspired activity library',
  metadataBase: new URL('https://montihome.example.com')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}


