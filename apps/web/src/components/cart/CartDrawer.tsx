'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export function CartDrawer() {
  const { items, updateQuantity, removeFromCart, getTotal, getItemCount, isCartOpen, setIsCartOpen } =
    useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push(ROUTES.CHECKOUT.BASE);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Giỏ Hàng ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Giỏ hàng của bạn đang trống</p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push(ROUTES.PRODUCTS.BASE);
                }}
              >
                Xem Sản Phẩm
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-sm font-semibold mt-1">
                        {item.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Tổng Cộng</span>
                <span>{getTotal().toLocaleString('vi-VN')}₫</span>
              </div>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Thanh Toán
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  Tiếp Tục Mua Sắm
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
