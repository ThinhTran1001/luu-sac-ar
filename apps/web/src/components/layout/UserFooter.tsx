import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function UserFooter() {
  return (
    <footer className="border-t bg-zinc-50 py-12 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-bold dark:bg-white dark:text-black">
                L
              </div>
              <span className="text-xl font-bold tracking-tight">LƯU SẮC</span>
            </Link>
            <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
              Premium quality ceramics and pottery designed for modern lifestyle. Artistry in every
              piece.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={ROUTES.PRODUCTS}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  All Collections
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CATEGORIES.VASES}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Vases & Decor
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CATEGORIES.TABLEWARE}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Tableware
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={ROUTES.CONTACT}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SHIPPING}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.RETURNS}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.PRIVACY}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.TERMS}
                  className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} LUU SAC. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6 md:mt-0">
            <span className="text-xs text-zinc-400">Handcrafted in Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
