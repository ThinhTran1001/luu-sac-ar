import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ArrowRight, Package, ShieldCheck, Heart, Sparkles, Smartphone, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-24 mb-20 -mt-8 md:-mt-12">
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-[80vh] w-[calc(100%+32px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] -mx-4 md:-mx-10 lg:-mx-20 overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Gốm sứ cao cấp Lưu Sắc"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 flex items-center">
          <div className="container px-4 md:px-10 lg:px-20 mx-auto text-white space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold tracking-wider uppercase border border-white/20">
                Gốm Sứ Cao Cấp • Thủ Công Tinh Xảo
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Nghệ Thuật <br />
                <span className="text-zinc-200">Trong Từng Tác Phẩm.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-100 font-light leading-relaxed max-w-xl">
                Khám phá bộ sưu tập gốm sứ thủ công tinh xảo, kết hợp truyền thống hàng trăm năm với thẩm mỹ tối giản hiện đại.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl hover:scale-105 transition-all">
                <Link href={ROUTES.PRODUCTS.BASE} className="gap-2">
                  Khám Phá Bộ Sưu Tập <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold text-white bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/20">
                <Link href={ROUTES.ABOUT}>
                  Câu Chuyện Của Chúng Tôi
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4 p-6 rounded-3xl bg-zinc-50 border group hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">Thủ Công Tinh Xảo</h3>
            <p className="text-muted-foreground">Mỗi tác phẩm đều được chế tác thủ công riêng biệt, đảm bảo tính độc bản và độ chính xác chỉ có bàn tay nghệ nhân mới tạo nên.</p>
          </div>
          <div className="space-y-4 p-6 rounded-3xl bg-zinc-50 border group hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">Chất Lượng Bảo Tàng</h3>
            <p className="text-muted-foreground">Nguyên liệu được chọn lọc kỹ càng, nung ở nhiệt độ tối ưu để đạt độ bền và hoàn thiện cao nhất.</p>
          </div>
          <div className="space-y-4 p-6 rounded-3xl bg-zinc-50 border group hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">An Toàn & Thân Thiện</h3>
            <p className="text-muted-foreground">Đóng gói thân thiện với môi trường, bảo vệ sản phẩm trong suốt hành trình giao hàng.</p>
          </div>
          <div className="space-y-4 p-6 rounded-3xl bg-zinc-50 border group hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">Xem 3D & Thực Tế Ảo</h3>
            <p className="text-muted-foreground">Xem trước sản phẩm yêu thích ngay trong phòng bạn bằng công nghệ Thực Tế Ảo Tăng Cường (AR) trước khi mua.</p>
          </div>
        </div>
      </section>

      {/* Category Discover Grid */}
      <section className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Khám Phá Bộ Sưu Tập</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Từ bộ đồ ăn tinh tế đến trang trí nghệ thuật, khám phá các danh mục sản phẩm và tìm kiếm món đồ hoàn hảo cho ngôi nhà của bạn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[600px] md:h-[500px]">
          <Link href={ROUTES.CATEGORIES.TABLEWARE} className="relative group overflow-hidden rounded-[40px] border col-span-1 lg:col-span-1 row-span-1 lg:row-span-2 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent z-10 transition-all opacity-70 group-hover:opacity-100" />
            <Image
              src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop"
              alt="Bộ đồ ăn gốm sứ"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 space-y-2 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl font-bold">Bộ Đồ Ăn Gốm Sứ</h3>
              <p className="text-zinc-300 font-medium">Đĩa, cốc và tô phục vụ tinh tế.</p>
              <div className="flex items-center gap-2 pt-4 font-bold border-t border-white/20 mt-4 group">
                Xem Bộ Sưu Tập <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href={ROUTES.CATEGORIES.VASES} className="relative group overflow-hidden rounded-[40px] border col-span-1 lg:col-span-2 row-span-1 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent z-10 transition-all opacity-70 group-hover:opacity-100" />
            <Image
              src="https://images.unsplash.com/photo-1581720336200-c9772ee508e4?q=80&w=1200&auto=format&fit=crop"
              alt="Bình hoa nghệ thuật"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 space-y-1 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl font-bold">Bình Hoa Nghệ Thuật</h3>
              <p className="text-zinc-300 font-medium">Những tác phẩm điêu khắc độc đáo cho không gian sống.</p>
              <div className="flex items-center gap-2 pt-2 font-bold group">
                Xem Bộ Sưu Tập <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href={ROUTES.PRODUCTS.BASE} className="relative group overflow-hidden rounded-[40px] border col-span-1 lg:col-span-2 row-span-1 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent z-10 transition-all opacity-70 group-hover:opacity-100" />
            <Image
              src="https://images.unsplash.com/photo-1493106819501-66d381c466f1?q=80&w=1200&auto=format&fit=crop"
              alt="Phiên bản đặc biệt"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 space-y-1 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl font-bold">Lưu Sắc Phiên Bản Đặc Biệt</h3>
              <p className="text-zinc-300 font-medium">Sáng tạo thủ công giới hạn từ các nghệ nhân hàng đầu.</p>
              <div className="flex items-center gap-2 pt-2 font-bold group">
                Khám Phá Thêm <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto">
        <FeaturedProducts />
      </section>

      {/* AR Preview */}
      <section className="py-12 px-4 md:px-10 lg:px-20 bg-zinc-900 text-white rounded-[40px] md:rounded-[60px] overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
        <div className="flex-1 space-y-8 py-10 order-2 lg:order-1">
          <div className="space-y-4">
            <HomeBadge variant="outline" className="text-zinc-300 border-zinc-700 font-bold uppercase tracking-wider py-1.5 px-4 rounded-full bg-zinc-800">
              <Smartphone className="inline mr-2 h-4 w-4" /> Thực Tế Ảo Tăng Cường
            </HomeBadge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Trải Nghiệm Nghệ Thuật <br /> Trong Không Gian Của Bạn.
            </h2>
            <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-lg">
              Chưa chắc chắn sản phẩm có phù hợp với phòng bạn? Sử dụng công nghệ AR để xem mô hình 3D ngay trên bàn hoặc kệ của bạn.
            </p>
          </div>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-zinc-300 font-medium text-lg lg:text-base xl:text-lg">
              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
              Hiển thị tỉ lệ 1:1 như thật
            </li>
            <li className="flex items-center gap-4 text-zinc-300 font-medium text-lg lg:text-base xl:text-lg">
              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
              Kết cấu và hoàn thiện chính xác
            </li>
            <li className="flex items-center gap-4 text-zinc-300 font-medium text-lg lg:text-base xl:text-lg">
              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
              Không cần tải ứng dụng - chạy trực tiếp trên trình duyệt
            </li>
          </ul>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-2xl group transition-all">
              <Link href={ROUTES.PRODUCTS.BASE} className="gap-2">
                Trải Nghiệm AR Ngay <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 h-[400px] lg:h-[600px] w-full relative group order-1 lg:order-2">
          <div className="absolute inset-0 rounded-[40px] bg-linear-to-br from-zinc-700/20 to-transparent p-4 transition-all duration-700 group-hover:scale-105">
            <div className="h-full w-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/ar-feature.png"
                alt="Tính năng AR"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute top-10 right-10 h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 shadow-2xl animate-bounce hidden xl:block">
            <Smartphone className="text-white h-full w-full opacity-60" />
          </div>
          <div className="absolute bottom-10 -left-10 h-16 w-16 rounded-full bg-white text-black items-center justify-center shadow-2xl animate-pulse hidden xl:flex">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto py-20 text-center space-y-10 border-t border-b">
        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className="text-5xl font-bold tracking-tight">Luôn Cập Nhật.</h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Đăng ký để nhận thông tin về các bộ sưu tập mới, câu chuyện nghệ nhân và ưu đãi độc quyền dành riêng cho thành viên.
          </p>
        </div>
        
        <form className="max-w-md mx-auto flex gap-3 flex-col sm:flex-row p-2 bg-zinc-50 border rounded-[32px]">
          <input 
            type="email" 
            placeholder="Nhập địa chỉ email của bạn" 
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-lg font-medium outline-none rounded-full"
            required
          />
          <Button size="lg" className="h-[60px] px-8 text-lg font-bold rounded-[24px]">
            Đăng Ký
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground opacity-60 pt-4 font-medium uppercase tracking-[0.2em]">
          Cảm Hứng Từ Di Sản Việt Nam • Chia Sẻ Với Thế Giới
        </p>
      </section>
    </div>
  );
}

function HomeBadge({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'outline', className?: string }) {
  const baseClasses = "px-3 py-1 text-xs font-semibold tracking-wider rounded-full flex items-center";
  const variants = {
    default: "bg-black text-white",
    outline: "border border-zinc-200 text-zinc-800"
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
