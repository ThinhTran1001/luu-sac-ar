'use client';

import { useState } from 'react';
import { usePublicProducts } from '@/hooks/usePublicProducts';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PublicProductQueryDto } from '@luu-sac/shared';
import { Button } from '@/components/ui/button';

export function ProductList() {
  const [filters, setFilters] = useState<PublicProductQueryDto>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, error } = usePublicProducts(filters);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Lỗi tải dữ liệu sản phẩm. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {data.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={data.meta.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Trước
              </Button>
              <div className="flex items-center px-4">
                Trang {data.meta.page} / {data.meta.totalPages}
              </div>
              <Button
                variant="outline"
                disabled={data.meta.page === data.meta.totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có sản phẩm nào.</p>
        </div>
      )}
    </div>
  );
}
