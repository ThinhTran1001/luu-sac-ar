'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Thanh Toán Đã Bị Hủy</h1>
            <p className="text-muted-foreground">
              Thanh toán của bạn đã bị hủy. Bạn sẽ không bị tính phí.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={ROUTES.CHECKOUT.BASE}>
              <Button className="w-full">Thử Lại</Button>
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
