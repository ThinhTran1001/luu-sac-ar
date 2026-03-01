'use client';

import { usePublicProducts } from '@/hooks/usePublicProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { ArrowRight } from 'lucide-react';

export function FeaturedProducts() {
  const { data, isLoading } = usePublicProducts({
    page: 1,
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <section className="py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sản Phẩm Nổi Bật</h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            Những tác phẩm được yêu thích nhất, chế tác thủ công với niềm đam mê và sự tỉ mỉ để mang lại vẻ đẹp cho cuộc sống hàng ngày.
          </p>
        </div>
        <Button asChild variant="ghost" className="hidden md:flex gap-2 text-lg h-auto py-2">
          <Link href={ROUTES.PRODUCTS.BASE}>
            Xem Tất Cả <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-2xl" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <p className="text-xl text-muted-foreground">Bộ sưu tập sắp ra mắt.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href={ROUTES.PRODUCTS.BASE}>Xem Danh Mục</Link>
          </Button>
        </div>
      )}

      <div className="mt-12 md:hidden">
        <Button asChild className="w-full text-lg h-12" variant="outline">
          <Link href={ROUTES.PRODUCTS.BASE}>Xem Tất Cả Sản Phẩm</Link>
        </Button>
      </div>
    </section>
  );
}
