import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

export function UserFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[#e8dfd0] py-14">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2">
            <Link href={ROUTES.HOME} className="inline-block mb-4">
              <Image
                src="/images/luusac-logo.png"
                alt="Lưu Sắc"
                width={140}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm text-[var(--muted-foreground)] leading-relaxed">
              Gốm sứ cao cấp thiết kế cho phong cách sống hiện đại. Nghệ thuật trong từng tác phẩm.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Cửa Hàng
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={ROUTES.PRODUCTS.BASE}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Tất Cả Sản Phẩm
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CATEGORIES.VASES}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Bình Hoa & Trang Trí
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CATEGORIES.TABLEWARE}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Bộ Đồ Ăn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Hỗ Trợ
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={ROUTES.CONTACT}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SHIPPING}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Chính Sách Vận Chuyển
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.RETURNS}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Đổi Trả & Hoàn Tiền
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Công Ty
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.PRIVACY}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.TERMS}
                  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
                >
                  Điều Khoản Dịch Vụ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)] text-center md:flex md:items-center md:justify-between">
          <p className="text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} LƯU SẮC. Bảo lưu mọi quyền.
          </p>
          <div className="mt-4 flex justify-center gap-6 md:mt-0">
            <span className="text-xs text-[var(--muted-foreground)]">Thủ Công Từ Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
