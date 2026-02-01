'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginDto, RegisterDto, UserDto } from '@luu-sac/shared';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: UserDto | null;
  login: (dto: LoginDto) => Promise<UserDto>;
  register: (dto: RegisterDto) => Promise<UserDto>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser) as UserDto);
    }
    setIsLoading(false);
  }, []);

  const login = async (dto: LoginDto): Promise<UserDto> => {
    const data = await authService.login(dto);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (dto: RegisterDto): Promise<UserDto> => {
    const data = await authService.register(dto);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };


  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
