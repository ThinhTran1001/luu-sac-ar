import Link from 'next/link';
import { ReactNode } from 'react';

// This is a server component by default
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Luu Sac Admin</h1>
        </div>
        <nav className="mt-6">
          <Link
            href="/admin"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/categories"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
          >
            Categories
          </Link>
          <Link
            href="/admin/products"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
          >
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
