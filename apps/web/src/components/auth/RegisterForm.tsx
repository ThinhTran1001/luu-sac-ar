'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';
import { RegisterSchema, RegisterDto } from '@luu-sac/shared';

export function RegisterForm() {
  const { register: registerAuth } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      await registerAuth(data);
      router.push(ROUTES.HOME);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Name</label>
          <input
            type="text"
            className={`w-full rounded border px-3 py-2 outline-none focus:border-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Email</label>
          <input
            type="email"
            className={`w-full rounded border px-3 py-2 outline-none focus:border-blue-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
          <input
            type="password"
            className={`w-full rounded border px-3 py-2 outline-none focus:border-blue-500 ${
              errors.password ? 'border-red-500' : ''
            }`}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </>
  );
}
