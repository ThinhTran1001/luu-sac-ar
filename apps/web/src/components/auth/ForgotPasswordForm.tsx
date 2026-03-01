'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/auth.service';
import { ForgotPasswordSchema, ForgotPasswordDto } from '@luu-sac/shared';
import { ROUTES } from '../../constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export function ForgotPasswordForm() {
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
      toast.success('Kiểm tra email của bạn để xem hướng dẫn đặt lại mật khẩu');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gửi email đặt lại mật khẩu thất bại';
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Địa chỉ Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Bạn đã nhớ mật khẩu?{' '}
            <Link href={ROUTES.AUTH.LOGIN} className="font-medium text-primary hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
