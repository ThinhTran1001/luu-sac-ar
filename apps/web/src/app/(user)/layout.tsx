import { UserHeader } from '@/components/layout/UserHeader';
import { UserFooter } from '@/components/layout/UserFooter';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserHeader />
      <main className="flex-1">
        {children}
      </main>
      <UserFooter />
    </>
  );
}
