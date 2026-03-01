'use client';

import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/services/product.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const promise = productService.create(formData);

    toast.promise(promise, {
      loading: 'Đang tạo sản phẩm...',
      success: () => {
        router.push(ROUTES.ADMIN.PRODUCTS.BASE);
        return 'Tạo sản phẩm thành công';
      },
      error: 'Tạo sản phẩm thất bại',
      finally: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">Thêm Sản Phẩm Mới</h1>
        <p className="text-muted-foreground">
          Điền thông tin bên dưới để tạo một sản phẩm gốm sứ mới.
        </p>
      </div>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
