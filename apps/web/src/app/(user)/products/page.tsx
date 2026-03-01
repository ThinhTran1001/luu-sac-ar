import { ProductList } from '@/components/products/ProductList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Sản Phẩm | Lưu Sắc',
  description: 'Khám phá bộ sưu tập gốm sứ thủ công của chúng tôi',
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Sản Phẩm Của Chúng Tôi</h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập nghệ thuật gốm sứ thủ công
        </p>
      </div>

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
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
