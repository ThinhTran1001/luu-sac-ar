'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order.service';
import { OrderResponseDto, PaginationMeta, OrderStatus } from '@luu-sac/shared';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPING: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function MyOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const status = statusFilter !== 'all' ? statusFilter : undefined;
        const result = await orderService.getMyOrders(page, 10, status);
        setOrders(result.data);
        setMeta(result.meta);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, page, statusFilter]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Đơn Hàng Của Tôi</h1>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tất cả Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Trạng thái</SelectItem>
            <SelectItem value="PENDING">Chờ Thanh Toán</SelectItem>
            <SelectItem value="PAID">Đã Thanh Toán</SelectItem>
            <SelectItem value="PROCESSING">Đang Xử Lý</SelectItem>
            <SelectItem value="SHIPPING">Đang Giao Hàng</SelectItem>
            <SelectItem value="COMPLETED">Hoàn Thành</SelectItem>
            <SelectItem value="CANCELLED">Đã Hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Không tìm thấy đơn hàng</h2>
          <p className="text-muted-foreground">
            {statusFilter !== 'all'
              ? 'Không có đơn hàng nào với trạng thái này.'
              : "Bạn chưa đặt đơn hàng nào."}
          </p>
          <Link href={ROUTES.PRODUCTS.BASE}>
            <Button>Xem Sản Phẩm</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={ROUTES.ORDERS.DETAIL(order.id)}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        #{order.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_COLORS[order.status]}>
                        {order.status}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="relative h-10 w-10 overflow-hidden rounded-md border-2 border-white"
                        >
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-white bg-gray-100 text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} sản phẩm
                      </p>
                    </div>
                    <p className="font-semibold text-lg">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Trang {page} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
