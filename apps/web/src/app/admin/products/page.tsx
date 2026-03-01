import { Suspense } from 'react';
import Link from 'next/link';
import { ProductTable } from './product-table';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { ROUTES } from '@/constants/routes';

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function ProductListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ['products', { page, limit }],
    queryFn: () => productService.findAll({ page, limit }),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sản Phẩm</h1>
        <Link
          href={ROUTES.ADMIN.PRODUCTS.CREATE}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Sản Phẩm Mới
        </Link>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Đang tải sản phẩm...</div>}>
          <ProductTable />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
