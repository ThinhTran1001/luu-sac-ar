'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';
import { RegisterSchema, RegisterDto } from '@luu-sac/shared';
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

export function RegisterForm() {
  const { register: registerAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      const user = await registerAuth(data);
      toast.success('Tạo tài khoản thành công');
      if (user.role === 'ADMIN') {
        router.push(ROUTES.ADMIN.BASE);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi không mong muốn xảy ra';
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
        <CardDescription>Nhập thông tin bên dưới để tạo tài khoản</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và Tên</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href={ROUTES.AUTH.LOGIN} className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
