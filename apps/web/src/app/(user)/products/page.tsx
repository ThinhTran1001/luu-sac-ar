import Image from 'next/image';
import Link from 'next/link';
import { ProductList } from '@/components/products/ProductList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Sản Phẩm | Lưu Sắc',
  description: 'Khám phá bộ sưu tập gốm sứ thủ công của chúng tôi',
};

export default function ProductsPage() {
  return (
    <div className="space-y-0 -mx-4 md:-mx-10 lg:-mx-20 -mt-8 md:-mt-12">
      {/* Banner trang Sản phẩm – chỉ ảnh, sát header */}
      <section className="relative h-[40vh] min-h-[280px] md:h-[45vh] w-full overflow-hidden">
        <Image
          src="/images/banner-product.jpg"
          alt="Bộ sưu tập Lưu Sắc"
          fill
          priority
          className="object-cover"
        />
      </section>

      {/* Section giới thiệu – nội dung tách khỏi banner */}
      <section className="bg-[var(--card)] py-12 md:py-14 border-b border-[var(--border)] mx-4 md:mx-10 lg:mx-20 rounded-t-2xl -mt-8 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            Gấp lại tinh hoa – mở ra đất nước
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            Nghệ thuật trong từng tác phẩm
          </h1>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
            Khám phá bộ sưu tập gốm sứ thủ công tinh xảo, kết hợp truyền thống với thẩm mỹ tối giản trong không gian sống đương đại.
          </p>
          <Button asChild size="lg" className="rounded-xl font-semibold h-11 px-6" variant="outline">
            <Link href={ROUTES.ABOUT} className="gap-2">
              Về chúng tôi <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="space-y-8 mx-4 md:mx-10 lg:mx-20 pt-10">
        <div className="text-center md:text-left space-y-2 pb-6 border-b border-[var(--border)]">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Bộ sưu tập nổi bật
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Sản phẩm của chúng tôi
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl">
            Khám phá bộ sưu tập nghệ thuật gốm sứ thủ công
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
        <Skeleton key={i} className="h-80 w-full rounded-2xl bg-[var(--muted)]" />
      ))}
    </div>
  );
}
