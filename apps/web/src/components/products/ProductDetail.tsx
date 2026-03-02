'use client';

import { usePublicProductDetail } from '@/hooks/usePublicProductDetail';
import { useCart } from '@/context/CartContext';
import { ProductGallery } from './ProductGallery';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';

const ProductViewer3D = dynamic(
  () => import('../ar/ProductViewer3D').then((mod) => mod.ProductViewer3D),
  { ssr: false },
);
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, isLoading, error } = usePublicProductDetail(productId);
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Không tìm thấy sản phẩm hoặc sản phẩm không khả dụng.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const images = [
    product.thumbnailImage || product.imageUrl,
    ...product.galleryImages,
  ].filter(Boolean);

  const hasAR = !!product.glbUrl;

  return (
    <div className="space-y-12">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Gallery or AR Viewer */}
        {hasAR ? (
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images">Hình Ảnh</TabsTrigger>
              <TabsTrigger value="3d">Xem 3D</TabsTrigger>
            </TabsList>
            <TabsContent value="images" className="mt-4">
              <ProductGallery images={images} productName={product.name} />
            </TabsContent>
            <TabsContent value="3d" className="mt-4">
              <ProductViewer3D
                modelUrl={product.glbUrl!}
                usdzUrl={product.usdzUrl ?? undefined}
                productName={product.name}
                posterUrl={product.thumbnailImage || product.imageUrl}
                processingStatus={product.processingStatus as any}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <ProductGallery images={images} productName={product.name} />
        )}

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category.name}</Badge>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Mô Tả</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {hasAR && (
            <Alert>
              <AlertDescription>
                📱 <strong>Hỗ Trợ Thực Tế Ảo (AR)!</strong> Chuyển sang thẻ Xem 3D và nhấn "Xem Trong Không Gian Của Bạn" (View in Your Space) trên thiết bị di động để xem sản phẩm này trong phòng của bạn.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                addToCart({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.thumbnailImage || product.imageUrl,
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
                setIsCartOpen(true);
              }}
              disabled={product.quantity <= 0}
            >
              {product.quantity <= 0 ? (
                'Hết Hàng'
              ) : added ? (
                <><Check className="mr-2 h-4 w-4" /> Đã Thêm Vào Giỏ</>
              ) : (
                <><ShoppingCart className="mr-2 h-4 w-4" /> Thêm Vào Giỏ Hàng</>
              )}
            </Button>
            {product.quantity > 0 && product.quantity <= 5 && (
              <p className="text-sm text-orange-600 text-center">
                Chỉ còn {product.quantity} sản phẩm trong kho!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
