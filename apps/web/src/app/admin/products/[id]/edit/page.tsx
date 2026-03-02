'use client';

import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/services/product.service';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { Loader2 } from 'lucide-react';
import { ProductDto } from '@luu-sac/shared';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<ProductDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .findOne(id)
      .then(setInitialData)
      .catch(() => {
        toast.error('Không tìm thấy sản phẩm');
        router.push(ROUTES.ADMIN.PRODUCTS.BASE);
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const promise = productService.update(id, formData);

    toast.promise(promise, {
      loading: 'Đang cập nhật sản phẩm...',
      success: () => {
        router.push(ROUTES.ADMIN.PRODUCTS.BASE);
        return 'Cập nhật sản phẩm thành công';
      },
      error: 'Cập nhật sản phẩm thất bại',
      finally: () => setIsSubmitting(false),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Chỉnh Sửa Sản Phẩm</h1>
        <p className="text-gray-500">Cập nhật thông tin sản phẩm gốm sứ.</p>
      </div>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
