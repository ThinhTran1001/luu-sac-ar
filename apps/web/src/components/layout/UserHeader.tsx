'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/cart/CartDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingBag, User, LogOut, Settings, Menu, Package } from 'lucide-react';

export function UserHeader() {
  const { user, logout } = useAuth();
  const { getItemCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const itemCount = getItemCount();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white shadow-sm">
      <div className="container mx-auto relative flex h-24 md:h-28 items-center px-4 md:px-10 lg:px-20">
        <div className="flex-1 flex items-center">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <Image
              src="/images/luusac-logo.png"
              alt="Lưu Sắc"
              width={280}
              height={96}
              className="h-14 w-auto sm:h-16 md:h-20 lg:h-[5.5rem] object-contain"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-base md:text-lg font-semibold text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
          >
            Trang Chủ
          </Link>
          <Link
            href={ROUTES.PRODUCTS.BASE}
            className="text-base md:text-lg font-semibold text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
          >
            Sản Phẩm
          </Link>
          <Link
            href={ROUTES.ABOUT}
            className="text-base md:text-lg font-semibold text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
          >
            Về Chúng Tôi
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] text-[var(--primary-foreground)]">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Button>
          <CartDrawer />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PROFILE}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Tài Khoản</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.ORDERS.BASE}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Đơn Hàng</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.ADMIN.BASE}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Quản Trị</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng Xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button variant="ghost" size="sm">
                  Đăng Nhập
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER}>
                <Button size="sm">Đăng Ký</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
