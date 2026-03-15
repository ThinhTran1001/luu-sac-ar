import type { Metadata } from 'next';
import { Geist, Geist_Mono, Cormorant_Garamond } from 'next/font/google';
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

const cormorant = Cormorant_Garamond({
  variable: '--font-luxury',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'LƯU SẮC | Premium Ceramics & Pottery',
  description: 'Exquisite handcrafted ceramics and pottery for your modern home.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

