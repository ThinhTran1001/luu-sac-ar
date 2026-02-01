'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, User, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <header className="h-16 border-b bg-white px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-md border w-72">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search something..."
          className="bg-transparent border-none text-sm focus:outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" title="View Store">
            <Home className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="relative text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-2 hover:bg-gray-50 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-blue-100">
                <AvatarImage src={user?.avatar || ''} />
                <AvatarFallback className="bg-blue-600 text-white font-bold">
                  {user?.name?.charAt(0) || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Profile settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
