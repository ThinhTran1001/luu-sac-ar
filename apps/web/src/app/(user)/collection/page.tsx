'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

// CSE image data organized by category
const collectionData = {
  vases: {
    title: 'Bình Hoa',
    description: 'Những tác phẩm gốm sứ độc đáo, mang hình dáng tinh tế và thanh lịch. Mỗi chiếc bình là một điểm nhấn nghệ thuật cho không gian sống của bạn.',
    images: [
      { src: '/images/CSE01687.jpg', name: 'Bình Hoa CDT 01' },
      { src: '/images/CSE01690.jpg', name: 'Bình Hoa CDT 02' },
      { src: '/images/CSE01691.jpg', name: 'Bình Hoa CDT 03' },
      { src: '/images/CSE01692.jpg', name: 'Bình Hoa CDT 04' },
      { src: '/images/CSE01693.jpg', name: 'Bình Hoa CDT 05' },
    ],
  },
  tableware: {
    title: 'Đồ Ăn',
    description: 'Bộ đồ ăn gốm sứ cao cấp được chế tác thủ công, hoàn hảo cho những bữa ăn gia đình hoặc tiệc quan trọng.',
    images: [
      { src: '/images/CSE01695.jpg', name: 'Đĩa Tròn CDT 01' },
      { src: '/images/CSE01697.jpg', name: 'Đĩa Tròn CDT 02' },
      { src: '/images/CSE01702.jpg', name: 'Bộ Đồ Ăn CDT 01' },
      { src: '/images/CSE01706.jpg', name: 'Bộ Đồ Ăn CDT 02' },
      { src: '/images/CSE01709.jpg', name: 'Bộ Đồ Ăn CDT 03' },
      { src: '/images/CSE01711.jpg', name: 'Bộ Đồ Ăn CDT 04' },
    ],
  },
  decor: {
    title: 'Trang Trí',
    description: 'Những tác phẩm nghệ thuật gốm sứ mang đậm dấu ấn thủ công Việt Nam, là điểm nhấn hoàn hảo cho không gian của bạn.',
    images: [
      { src: '/images/CSE01714.jpg', name: 'Tác Phẩm Nghệ Thuật 01' },
      { src: '/images/CSE01715.jpg', name: 'Tác Phẩm Nghệ Thuật 02' },
      { src: '/images/CSE01718.jpg', name: 'Tác Phẩm Nghệ Thuật 03' },
      { src: '/images/CSE01725.jpg', name: 'Tác Phẩm Nghệ Thuật 04' },
      { src: '/images/CSE01727.jpg', name: 'Tác Phẩm Nghệ Thuật 05' },
      { src: '/images/CSE01729.jpg', name: 'Tác Phẩm Nghệ Thuật 06' },
      { src: '/images/CSE01731.jpg', name: 'Tác Phẩm Nghệ Thuật 07' },
      { src: '/images/CSE01735.jpg', name: 'Tác Phẩm Nghệ Thuật 08' },
      { src: '/images/CSE01737.jpg', name: 'Tác Phẩm Nghệ Thuật 09' },
      { src: '/images/CSE01738.jpg', name: 'Tác Phẩm Nghệ Thuật 10' },
      { src: '/images/CSE01740.jpg', name: 'Tác Phẩm Nghệ Thuật 11' },
      { src: '/images/CSE01741.jpg', name: 'Tác Phẩm Nghệ Thuật 12' },
      { src: '/images/CSE01742.jpg', name: 'Tác Phẩm Nghệ Thuật 13' },
      { src: '/images/CSE01743.jpg', name: 'Tác Phẩm Nghệ Thuật 14' },
      { src: '/images/CSE01744.jpg', name: 'Tác Phẩm Nghệ Thuật 15' },
      { src: '/images/CSE01747.jpg', name: 'Tác Phẩm Nghệ Thuật 16' },
      { src: '/images/CSE01751.jpg', name: 'Tác Phẩm Nghệ Thuật 17' },
      { src: '/images/CSE01752.jpg', name: 'Tác Phẩm Nghệ Thuật 18' },
    ],
  },
};

function ProductCard({ image, index }: { image: { src: string; name: string }; index: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[var(--foreground)] text-lg line-clamp-1">
          {image.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
          Tác phẩm gốm sứ thủ công cao cấp, mang đậm nghệ thuật truyền thống Việt Nam.
        </p>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  data,
  index,
}: {
  category: string;
  data: { title: string; description: string; images: { src: string; name: string }[] };
  index: number;
}) {
  return (
    <section
      id={category}
      className="py-16 md:py-20 border-t border-[var(--border)]"
    >
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            {index + 1} / 3
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            {data.title}
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.images.map((image, imgIndex) => (
            <ProductCard key={imgIndex} image={image} index={imgIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CollectionPage() {
  const categories = Object.entries(collectionData) as [
    keyof typeof collectionData,
    (typeof collectionData)[keyof typeof collectionData]
  ][];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Banner – same as homepage */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] w-[calc(100%+32px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] -mx-4 md:-mx-10 lg:-mx-20 -mt-8 md:-mt-12 overflow-hidden">
        <Image
          src="/images/luusac-banner.png"
          alt="Bộ sưu tập Lưu Sắc"
          fill
          priority
          className="object-cover"
        />
      </section>

      {/* Page Title */}
      <section className="bg-[var(--card)] py-10 md:py-14 border-b border-[var(--border)] mt-8 md:mt-12">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            Bộ Sưu Tập
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Khám phá những tác phẩm gốm sứ thủ công độc đáo, được chế tác tỉ mỉ bởi các nghệ nhân tài ba.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <nav className="sticky top-24 z-40 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] py-4">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            {categories.map(([key, data]) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-sm md:text-base font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
              >
                {data.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Category Sections */}
      {categories.map(([key, data], index) => (
        <CategorySection key={key} category={key} data={data} index={index} />
      ))}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[var(--primary)] text-[var(--primary-foreground)]">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Khám phá thêm nhiều tác phẩm
          </h2>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn về các sản phẩm gốm sứ cao cấp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-12 px-6 rounded-xl font-semibold bg-white text-[var(--primary)] hover:bg-white/90">
              <Link href={ROUTES.PRODUCTS.BASE}>
                Xem tất cả sản phẩm <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-xl font-semibold border-white text-white hover:bg-white hover:text-[var(--primary)]">
              <Link href={ROUTES.STORY}>
                Về chúng tôi <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
