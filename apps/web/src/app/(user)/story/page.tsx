'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, Sparkles, Heart, Award } from 'lucide-react';

// CSE image data for story - organized to show craftsmanship journey
const storyImages = {
  // Products that showcase craftsmanship
  craftsmanship: [
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512400/CSE01687_xatqxf.jpg', alt: 'Gốm sứ thủ công tinh xảo' },
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512401/CSE01714_okk3td.jpg', alt: 'Tác phẩm nghệ thuật độc đáo' },
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512398/CSE01731_gmo3vx.jpg', alt: 'Sự tỉ mỉ trong từng chi tiết' },
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512397/CSE01744_tme0pc.jpg', alt: 'Nghệ thuật truyền thống' },
  ],
  // Products showing variety and artistry
  collection: [
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512397/CSE01690_bwd1fb.jpg', alt: 'Bình hoa thanh lịch' },
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512401/CSE01702_w8tyhs.jpg', alt: 'Bộ đồ ăn cao cấp' },
    { src: 'https://res.cloudinary.com/dnm1hfesq/image/upload/v1773512403/CSE01727_itd8lk.jpg', alt: 'Tác phẩm trang trí' },
    { src: '/images/CSE01752.jpg', alt: 'Điểm nhấn cho không gian' },
  ],
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Banner – same as homepage */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] w-[calc(100%+32px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] -mx-4 md:-mx-10 lg:-mx-20 -mt-8 md:-mt-12 overflow-hidden">
        <Image
          src="/images/luusac-banner.png"
          alt="Câu chuyện Lưu Sắc"
          fill
          priority
          className="object-cover"
        />
      </section>

      {/* Page Title */}
      <section className="bg-[var(--card)] py-10 md:py-14 border-b border-[var(--border)] mt-8 md:mt-12">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            <Heart className="h-4 w-4" /> Câu Chuyện Của Chúng Tôi
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            Truyền Thống & Tâm Huyết
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Khám phá hành trình của Lưu Sắc - nơi nghệ thuật gốm sứ Việt Nam được đánh thức trong từng tác phẩm.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 max-w-4xl text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-6">
            Khởi Nguồn
          </h2>
          <p className="text-[var(--foreground)] text-xl md:text-2xl leading-relaxed font-medium">
            "Lưu Sắc khởi sinh từ khát vọng đánh thức di sản gốm sứ Việt Nam trong từng tác phẩm."
          </p>
          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mt-6">
            Chúng tôi tin rằng mỗi món gốm không chỉ là vật dụng, mà là một tác phẩm nghệ thuật mang trong mình câu chuyện về đôi bàn tay nghệ nhân, về đất nung nóng, về lửa và khói - những yếu tố đã tạo nên di sản hàng nghìn năm của dân tộc.
          </p>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                <Sparkles className="h-4 w-4" /> Tinh Hoa Thủ Công
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                Sự Tỉ Mỉ Trong Từng Tác Phẩm
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                Mỗi sản phẩm Lưu Sắc được chế tác thủ công bởi những nghệ nhân có hàng chục năm kinh nghiệm. Từ việc chọn đất, nhào nặn, tạo hình, đến tráng men và nung lò - tất cả đều đòi hỏi sự chính xác tuyệt đối và đôi bàn tay điêu luyện.
              </p>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                Chúng tôi không sản xuất hàng loạt. Thay vào đó, mỗi tác phẩm là một phiên bản độc nhất, mang trong mình dấu ấn cá nhân của người tạo ra nó.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {storyImages.craftsmanship.map((img, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-2xl overflow-hidden shadow-lg ${
                    index % 2 === 1 ? 'lg:translate-y-8' : ''
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-[var(--secondary)]">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
              Những nguyên tắc định hình mọi quyết định của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">Tâm Huyết</h3>
              <p className="text-[var(--muted-foreground)]">
                Mỗi tác phẩm được tạo ra với sự trân trọng và tình yêu dành cho nghề thủ công truyền thống.
              </p>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">Chất Lượng</h3>
              <p className="text-[var(--muted-foreground)]">
                Chỉ sử dụng nguyên liệu tốt nhất và quy trình kiểm tra nghiêm ngặt để đảm bảo mỗi sản phẩm đều hoàn hảo.
              </p>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">Sáng Tạo</h3>
              <p className="text-[var(--muted-foreground)]">
                Kết hợp giữa kỹ thuật truyền thống và thiết kế hiện đại để tạo ra những tác phẩm độc đáo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
              {storyImages.collection.map((img, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-2xl overflow-hidden shadow-lg ${
                    index % 2 === 0 ? 'lg:translate-y-8' : ''
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                <Award className="h-4 w-4" /> Bộ Sưu Tập
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                Nghệ Thuật Trong Từng Sản Phẩm
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                Từ những chiếc bình hoa tinh tế đến bộ đồ ăn cao cấp, từ tác phẩm trang trí độc đáo đến những món quà ý nghĩa - mỗi sản phẩm Lưu Sắc đều mang trong mình câu chuyện về sự khéo léo và sáng tạo.
              </p>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                Chúng tôi mời bạn khám phá bộ sưu tập của mình - nơi truyền thống gặp gỡ hiện đại, nơi mỗi tác phẩm đều là một điểm nhấn cho không gian sống của bạn.
              </p>
              <Button asChild size="lg" className="h-12 px-6 rounded-xl font-semibold">
                <Link href={ROUTES.COLLECTION}>
                  Khám phá bộ sưu tập <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[var(--primary)] text-[var(--primary-foreground)]">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Cùng Khám Phá Nghệ Thuật Gốm Sứ
          </h2>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn về các sản phẩm gốm sứ cao cấp hoặc ghé thăm showroom để trải nghiệm trực tiếp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-12 px-6 rounded-xl font-semibold bg-white text-[var(--primary)] hover:bg-white/90">
              <Link href={ROUTES.PRODUCTS.BASE}>
                Xem sản phẩm <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-xl font-semibold border-white text-white hover:bg-white hover:text-[var(--primary)]">
              <Link href={ROUTES.COLLECTION}>
                Bộ sưu tập <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
