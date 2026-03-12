import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ArrowRight, Package, ShieldCheck, Heart, Sparkles, Smartphone, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-0 mb-20">
      {/* Hero Banner – chỉ ảnh, sát header không khoảng trống */}
      <section className="relative min-h-[70vh] md:min-h-[75vh] w-[calc(100%+32px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] -mx-4 md:-mx-10 lg:-mx-20 -mt-8 md:-mt-12 overflow-hidden">
        <Image
          src="/images/luusac-banner.png"
          alt="Lưu Sắc – Gốm sứ cao cấp"
          fill
          priority
          className="object-cover"
        />
      </section>

      {/* Section giới thiệu – nội dung tách khỏi banner */}
      <section className="bg-[var(--card)] py-14 md:py-20 border-b border-[var(--border)] mt-8 md:mt-12">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            Gấp lại tinh hoa – mở ra đất nước
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-4">
            Nghệ thuật trong từng tác phẩm
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-8">
            Khám phá bộ sưu tập gốm sứ thủ công tinh xảo, kết hợp truyền thống với thẩm mỹ tối giản hiện đại.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="h-12 px-6 rounded-xl font-semibold">
              <Link href={ROUTES.PRODUCTS.BASE} className="gap-2">
                Tìm hiểu thêm <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-xl font-semibold border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
              <Link href={ROUTES.ABOUT}>Về chúng tôi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GIỚI THIỆU – giống Nếp gấp non sông */}
      <section className="bg-[var(--card)] py-16 md:py-20 border-y border-[var(--border)]">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 max-w-4xl text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-6">
            Giới thiệu
          </h2>
          <p className="text-[var(--foreground)] text-lg md:text-xl leading-relaxed mb-6">
            Lưu Sắc khởi sinh từ khát vọng đánh thức di sản gốm sứ Việt trong từng tác phẩm. Mỗi sản phẩm không chỉ là nơi lưu giữ tri thức thủ công, mà còn là tác phẩm nghệ thuật mang giá trị sưu tầm, khơi gợi niềm tự hào và khát vọng sáng tạo.
          </p>
          <Button asChild variant="outline" className="rounded-xl border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
            <Link href={ROUTES.ABOUT}>Xem thêm</Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us – tone beige */}
      <section className="container mx-auto py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] group hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">Thủ Công Tinh Xảo</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">Mỗi tác phẩm đều được chế tác thủ công riêng biệt, đảm bảo tính độc bản và độ chính xác chỉ có bàn tay nghệ nhân mới tạo nên.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] group hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">Chất Lượng Bảo Tàng</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">Nguyên liệu được chọn lọc kỹ càng, nung ở nhiệt độ tối ưu để đạt độ bền và hoàn thiện cao nhất.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] group hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 group-hover:scale-105 transition-transform">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">An Toàn & Thân Thiện</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">Đóng gói thân thiện với môi trường, bảo vệ sản phẩm trong suốt hành trình giao hàng.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] group hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">Xem 3D & Thực Tế Ảo</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">Xem trước sản phẩm bằng công nghệ AR ngay trong không gian của bạn trước khi mua.</p>
          </div>
        </div>
      </section>

      {/* Bộ sưu tập – style Nếp gấp non sông */}
      <section className="container mx-auto space-y-10 py-16">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Bộ sưu tập
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            Khám Phá Bộ Sưu Tập
          </h3>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg leading-relaxed">
            Từ bộ đồ ăn tinh tế đến trang trí nghệ thuật, tìm món đồ hoàn hảo cho ngôi nhà của bạn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[580px] md:h-[480px]">
          <Link href={ROUTES.CATEGORIES.TABLEWARE} className="relative group overflow-hidden rounded-2xl border border-[var(--border)] col-span-1 lg:col-span-1 row-span-1 lg:row-span-2 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/85 via-[#2c3e50]/20 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop"
              alt="Bộ đồ ăn gốm sứ"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2 text-white">
              <h3 className="text-2xl font-bold">Bộ Đồ Ăn Gốm Sứ</h3>
              <p className="text-white/90 text-sm">Đĩa, cốc và tô phục vụ tinh tế.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold pt-2 border-t border-white/30 mt-2">
                Xem bộ sưu tập <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link href={ROUTES.CATEGORIES.VASES} className="relative group overflow-hidden rounded-2xl border border-[var(--border)] col-span-1 lg:col-span-2 row-span-1 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/85 via-[#2c3e50]/20 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1581720336200-c9772ee508e4?q=80&w=1200&auto=format&fit=crop"
              alt="Bình hoa nghệ thuật"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1 text-white">
              <h3 className="text-2xl font-bold">Bình Hoa Nghệ Thuật</h3>
              <p className="text-white/90 text-sm">Tác phẩm điêu khắc độc đáo cho không gian sống.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold pt-2">
                Xem bộ sưu tập <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link href={ROUTES.PRODUCTS.BASE} className="relative group overflow-hidden rounded-2xl border border-[var(--border)] col-span-1 lg:col-span-2 row-span-1 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/85 via-[#2c3e50]/20 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1493106819501-66d381c466f1?q=80&w=1200&auto=format&fit=crop"
              alt="Phiên bản đặc biệt"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1 text-white">
              <h3 className="text-2xl font-bold">Lưu Sắc Phiên Bản Đặc Biệt</h3>
              <p className="text-white/90 text-sm">Sáng tạo thủ công giới hạn từ nghệ nhân hàng đầu.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold pt-2">
                Khám phá thêm <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto">
        <FeaturedProducts />
      </section>

      {/* AR Preview – dùng primary blue thay vì đen */}
      <section className="py-14 px-4 md:px-10 lg:px-20 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-2xl md:rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-lg container mx-auto">
        <div className="flex-1 space-y-6 py-8 order-2 lg:order-1">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/90">
              <Smartphone className="h-4 w-4" /> Thực Tế Ảo Tăng Cường
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
              Trải nghiệm nghệ thuật trong không gian của bạn
            </h2>
            <p className="text-white/90 font-light leading-relaxed max-w-lg">
              Xem mô hình 3D ngay trên bàn hoặc kệ của bạn bằng công nghệ AR, không cần tải ứng dụng.
            </p>
          </div>
          <ul className="space-y-3">
            {['Hiển thị tỉ lệ 1:1 như thật', 'Kết cấu và hoàn thiện chính xác', 'Chạy trực tiếp trên trình duyệt'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                <div className="h-2 w-2 rounded-full bg-white/80" />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="h-12 px-6 bg-white text-[var(--primary)] hover:bg-white/90 rounded-xl font-semibold">
            <Link href={ROUTES.PRODUCTS.BASE} className="gap-2">
              Trải nghiệm AR <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex-1 h-[320px] lg:h-[400px] w-full relative order-1 lg:order-2 rounded-xl overflow-hidden bg-white/10">
          <Image
            src="/images/ar-feature.png"
            alt="Tính năng AR"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Newsletter – tone beige */}
      <section className="container mx-auto py-16 md:py-20 text-center space-y-8 border-t border-[var(--border)] bg-[var(--card)] rounded-2xl mt-16">
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Luôn cập nhật
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Đăng ký để nhận thông tin bộ sưu tập mới, câu chuyện nghệ nhân và ưu đãi dành cho thành viên.
          </p>
        </div>
        <form className="max-w-md mx-auto flex gap-3 flex-col sm:flex-row p-2 bg-[var(--muted)] border border-[var(--border)] rounded-2xl">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none rounded-xl"
            required
          />
          <Button size="lg" className="h-12 px-6 rounded-xl font-semibold">
            Đăng ký
          </Button>
        </form>
        <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest">
          Cảm hứng từ di sản Việt Nam
        </p>
      </section>
    </div>
  );
}
