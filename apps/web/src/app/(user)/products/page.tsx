import { ProductList } from '@/components/products/ProductList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Products | Luu Sac',
  description: 'Browse our collection of handcrafted ceramic products',
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
          <p className="text-muted-foreground">
            Discover our collection of handcrafted ceramic art
          </p>
        </div>

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-80 w-full" />
      ))}
    </div>
  );
}
