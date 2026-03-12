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
    <section className="py-16 border-t border-[var(--border)]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Sản phẩm nổi bật
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Sản Phẩm Nổi Bật
          </h3>
          <p className="text-[var(--muted-foreground)] max-w-lg leading-relaxed">
            Những tác phẩm được yêu thích nhất, chế tác thủ công với niềm đam mê và sự tỉ mỉ.
          </p>
        </div>
        <Button asChild variant="outline" className="hidden md:flex gap-2 h-auto py-2 rounded-xl border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
          <Link href={ROUTES.PRODUCTS.BASE}>
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-full rounded-2xl bg-[var(--muted)]" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--muted)]/50 rounded-2xl border border-[var(--border)] border-dashed">
          <p className="text-[var(--muted-foreground)]">Bộ sưu tập sắp ra mắt.</p>
          <Button asChild className="mt-4 rounded-xl" variant="outline">
            <Link href={ROUTES.PRODUCTS.BASE}>Xem danh mục</Link>
          </Button>
        </div>
      )}

      <div className="mt-10 md:hidden">
        <Button asChild className="w-full h-12 rounded-xl" variant="outline">
          <Link href={ROUTES.PRODUCTS.BASE}>Xem tất cả sản phẩm</Link>
        </Button>
      </div>
    </section>
  );
}
