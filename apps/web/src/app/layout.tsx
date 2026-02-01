import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Providers } from '../components/providers';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

import { UserHeader } from '@/components/layout/UserHeader';
import { UserFooter } from '@/components/layout/UserFooter';

export const metadata: Metadata = {
  title: 'LUU SAC | Premium Ceramics & Pottery',
  description: 'Exquisite handcrafted ceramics and pottery for your modern home.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <AuthProvider>
            <UserHeader />
            <main className="flex-1">{children}</main>
            <UserFooter />
          </AuthProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
