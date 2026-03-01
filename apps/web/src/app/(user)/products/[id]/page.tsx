import { ProductDetail } from '@/components/products/ProductDetail';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail productId={id} />
    </Suspense>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
