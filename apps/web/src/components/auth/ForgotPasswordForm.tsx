'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/auth.service';
import { ForgotPasswordSchema, ForgotPasswordDto } from '@luu-sac/shared';

export function ForgotPasswordForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    try {
      await authService.forgotPassword(data.email);

      setMessage('Check your email for reset instructions.');
      setError('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send reset email');
      }
      setMessage('');
    }
  };

  return (
    <>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </>
  );
}
