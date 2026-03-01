import { UserHeader } from '@/components/layout/UserHeader';
import { UserFooter } from '@/components/layout/UserFooter';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-8 md:py-12">
          {children}
        </div>
      </main>
      <UserFooter />
    </>
  );
}
