'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order.service';
import { OrderResponseDto } from '@luu-sac/shared';
import { ROUTES } from '@/constants/routes';
import { OrderStatusTimeline } from '@/components/orders/OrderStatusTimeline';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Image from 'next/image';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPayProcessing, setIsPayProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [user, id]);

  const handleRetryPayment = async () => {
    if (!order) return;
    setIsPayProcessing(true);
    try {
      const payment = await orderService.createPaymentLink(order.id);
      window.location.href = payment.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thanh toán thất bại');
      setIsPayProcessing(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Không tìm thấy đơn hàng'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link
        href={ROUTES.ORDERS.BASE}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Quay lại Đơn Hàng Của Tôi
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Chi Tiết Đơn Hàng</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">#{order.id.slice(0, 8)}</p>
        </div>
        <Badge
          className={
            order.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : order.status === 'CANCELLED'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }
        >
          {order.status}
        </Badge>
      </div>

      {/* Status Timeline */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Trạng Thái Đơn Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline currentStatus={order.status} />
        </CardContent>
      </Card>

      {/* Retry Payment if PENDING */}
      {order.status === 'PENDING' && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold">Yêu Cầu Thanh Toán</p>
              <p className="text-sm text-muted-foreground">
                Vui lòng thanh toán để đơn hàng được xử lý.
              </p>
            </div>
            <Button onClick={handleRetryPayment} disabled={isPayProcessing}>
              <CreditCard className="mr-2 h-4 w-4" />
              {isPayProcessing ? 'Đang Xử Lý...' : 'Thanh Toán Ngay'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sản Phẩm ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.price.toLocaleString('vi-VN')}₫ × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng Cộng</span>
            <span>{order.totalAmount.toLocaleString('vi-VN')}₫</span>
          </div>
        </CardContent>
      </Card>

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Đơn Hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày Đặt Hàng</span>
            <span>
              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cập Nhật Lần Cuối</span>
            <span>
              {new Date(order.updatedAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
