'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategorySchema, CreateCategoryDto } from '@luu-sac/shared';
import { categoryService } from '@/services/category.service';
import { useRouter } from 'next/navigation';
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
import { ROUTES } from '@/constants/routes';

export default function CreateCategoryPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryDto>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const onSubmit = async (data: CreateCategoryDto) => {
    const promise = categoryService.create(data);

    toast.promise(promise, {
      loading: 'Đang tạo danh mục...',
      success: () => {
        router.push(ROUTES.ADMIN.CATEGORIES.BASE);
        return 'Tạo danh mục thành công';
      },
      error: 'Tạo danh mục thất bại',
    });
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Tạo Danh Mục Mới</CardTitle>
          <CardDescription>Thêm mới danh mục để phân loại sản phẩm của bạn.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Danh Mục</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Gốm Truyền Thống, Nghệ Thuật Hiện Đại..."
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang Tạo...' : 'Tạo Danh Mục'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
