'use client';

import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/services/product.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await productService.create(formData);
      router.push('/admin/products');
    } catch (error) {
      console.error('Create product failed', error);
      alert('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
