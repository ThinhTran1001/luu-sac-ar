'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Thanh Toán Thành Công!</h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
            </p>
            {orderCode && (
              <p className="text-sm text-muted-foreground">
                Mã đơn hàng: <span className="font-mono font-semibold">{orderCode}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Link href={ROUTES.ORDERS.BASE}>
              <Button className="w-full">Xem Đơn Hàng Của Tôi</Button>
            </Link>
            <Link href={ROUTES.PRODUCTS.BASE}>
              <Button variant="outline" className="w-full">
                Tiếp Tục Mua Sắm
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
