'use client';

import ProductForm, { type ProductFormSubmitData } from '@/components/admin/ProductForm';
import { productService } from '@/services/product.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { submitGeneration } from '@/services/ai3d-studio.service';
import { useBackground3DStore } from '@/stores/background-3d.store';

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTask = useBackground3DStore((s) => s.addTask);

  const handleSubmit = async ({ formData, arImageFile }: ProductFormSubmitData) => {
    setIsSubmitting(true);

    try {
      const product = await productService.create(formData);

      if (arImageFile) {
        const taskId = await submitGeneration(arImageFile);

        addTask({
          productId: product.id,
          productName: product.name,
          taskId,
        });

        toast.info('Sản phẩm đã được tạo. Đang tạo mô hình 3D trong nền...', {
          description: 'Sản phẩm sẽ tự động chuyển sang Hoạt Động khi tạo 3D hoàn tất.',
          duration: 5000,
        });
      } else {
        toast.success('Tạo sản phẩm thành công');
      }

      router.push(ROUTES.ADMIN.PRODUCTS.BASE);
    } catch {
      toast.error('Tạo sản phẩm thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Thêm Sản Phẩm Mới</h1>
        <p className="text-gray-500">Điền thông tin bên dưới để tạo một sản phẩm gốm sứ mới.</p>
      </div>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
