import Link from 'next/link';
import { ReactNode } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { ROUTES } from '@/constants/routes';
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const menuItems = [
    { name: 'Dashboard', href: ROUTES.ADMIN.BASE, icon: LayoutDashboard },
    { name: 'Categories', href: ROUTES.ADMIN.CATEGORIES.BASE, icon: Tag },
    { name: 'Products', href: ROUTES.ADMIN.PRODUCTS.BASE, icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex-col z-40 hidden md:flex shadow-sm">
        <div className="h-16 flex items-center px-8 border-b">
          <Link href={ROUTES.ADMIN.BASE} className="flex items-center gap-2">
            <div className="h-7 w-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold text-gray-900 tracking-tight">
              LƯU SẮC <span className="text-blue-600">ADMIN</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.name}
              </div>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t bg-gray-50/50">
          <div className="px-4 py-3 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Premium Plan</p>
            <p className="text-sm font-bold mt-0.5">Luu Sac Enterprise</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
