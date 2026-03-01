'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order.service';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Giỏ hàng của bạn đang trống</h1>
        <p className="text-muted-foreground">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link href={ROUTES.PRODUCTS.BASE}>
          <Button>Xem Sản Phẩm</Button>
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Vui lòng đăng nhập để thanh toán</h1>
        <p className="text-muted-foreground">Bạn cần có tài khoản để đặt hàng.</p>
        <Link href={ROUTES.AUTH.LOGIN}>
          <Button>Đăng Nhập</Button>
        </Link>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order
      const order = await orderService.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // 2. Create payment link
      const payment = await orderService.createPaymentLink(order.id);

      // 3. Clear cart and redirect to PayOS
      clearCart();
      window.location.href = payment.checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Thanh toán thất bại';
      setError(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href={ROUTES.PRODUCTS.BASE}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Tiếp Tục Mua Sắm
      </Link>

      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản Phẩm Đặt Mua ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Sl: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm Tính</span>
                <span>{getTotal().toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí Vận Chuyển</span>
                <span className="text-green-600">Miễn Phí</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng Cộng</span>
                <span>{getTotal().toLocaleString('vi-VN')}₫</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessing ? 'Đang Xử Lý...' : 'Thanh Toán qua PayOS'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Bạn sẽ được chuyển hướng tới PayOS để hoàn tất việc thanh toán
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
