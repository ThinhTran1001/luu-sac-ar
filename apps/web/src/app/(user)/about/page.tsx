import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Lightbulb, Link2, Users, Award } from 'lucide-react';

export const metadata = {
  title: 'Về Chúng Tôi | Lưu Sắc',
  description: 'Giới thiệu về Lưu Sắc – Gốm sứ cao cấp, nghệ thuật trong từng tác phẩm.',
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto pt-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-4">
          Giới thiệu
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)] mb-8">
          Gấp lại tinh hoa – mở ra đất nước
        </p>
        <p className="text-[var(--foreground)] text-lg leading-relaxed mb-6">
          Lưu Sắc khởi sinh từ khát vọng đánh thức di sản gốm sứ Việt trong từng tác phẩm. Ở đó, lịch sử thủ công không chỉ được nhìn thấy mà còn có thể chạm vào – để mỗi thế hệ cảm nhận trọn vẻ đẹp ngàn năm của dân tộc bằng cả trái tim.
        </p>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          Trong sự giao hòa tinh tế giữa nghệ thuật truyền thống và thiết kế hiện đại, Lưu Sắc tái hiện những giá trị văn hóa Việt qua từng đường nét gốm sứ. Mỗi sản phẩm không chỉ là nơi lưu giữ tri thức thủ công, mà còn là tác phẩm nghệ thuật mang giá trị sưu tầm, khơi gợi niềm tự hào và khát vọng sáng tạo.
        </p>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="border-t border-[var(--border)] pt-16">
        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-4">
          Giá trị cốt lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          <div className="text-center md:text-left p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">Sáng tạo</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Kể những câu chuyện cũ bằng một tâm hồn mới. Mỗi tác phẩm là sự kết nối giữa quá khứ vàng son với hiện tại tự hào.
            </p>
          </div>
          <div className="text-center md:text-left p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 mb-4">
              <Link2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">Kết nối</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Lưu Sắc là cầu nối đưa hồn cốt, vẻ đẹp và bản sắc gốm sứ Việt Nam đến gần hơn với mọi người.
            </p>
          </div>
          <div className="text-center md:text-left p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">Con người</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Sức mạnh lớn nhất đến từ trái tim và trí tuệ tập thể – những người mang trong mình tình yêu với nghề gốm.
            </p>
          </div>
          <div className="text-center md:text-left p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">Chất lượng</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Chất lượng không phải là một tiêu chí, mà là lời hứa. Từng đường nét đều là kết tinh của sự tỉ mỉ.
            </p>
          </div>
        </div>
      </section>

      {/* Sứ mệnh & Tầm nhìn */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[var(--border)] pt-16">
        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Sứ mệnh</h3>
          <p className="text-[var(--foreground)] leading-relaxed">
            Lưu Sắc hướng đến việc tôn vinh và lan tỏa vẻ đẹp gốm sứ Việt Nam bằng cách kết hợp độc đáo giữa nghề thủ công truyền thống với công nghệ hiện đại. Chúng tôi mong muốn truyền cảm hứng cho mọi người kết nối sâu sắc hơn với di sản thủ công, đồng thời cam kết sử dụng vật liệu thân thiện với môi trường và thiết kế bền vững.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Tầm nhìn</h3>
          <p className="text-[var(--foreground)] leading-relaxed">
            Trong những năm tới, Lưu Sắc mong muốn trở thành thương hiệu tiên phong trong việc kể lại lịch sử và văn hóa gốm sứ Việt, tận dụng sự kết hợp giữa nghệ thuật thủ công với công nghệ AR/3D để đưa di sản đến gần hơn với khách hàng trong nước và quốc tế.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center border-t border-[var(--border)] pt-16">
        <Button asChild size="lg" className="rounded-xl font-semibold h-12 px-8">
          <Link href={ROUTES.PRODUCTS.BASE}>Mua hàng ngay</Link>
        </Button>
      </section>
    </div>
  );
}
