'use client';

import { usePublicProductDetail } from '@/hooks/usePublicProductDetail';
import { ProductGallery } from './ProductGallery';
import { ProductViewer3D } from '../ar/ProductViewer3D';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, isLoading, error } = usePublicProductDetail(productId);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Product not found or unavailable.</AlertDescription>
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
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="3d">3D View</TabsTrigger>
            </TabsList>
            <TabsContent value="images" className="mt-4">
              <ProductGallery images={images} productName={product.name} />
            </TabsContent>
            <TabsContent value="3d" className="mt-4">
              <ProductViewer3D
                modelUrl={product.glbUrl!}
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
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {hasAR && (
            <Alert>
              <AlertDescription>
                📱 <strong>AR Available!</strong> Switch to the 3D View tab and tap "View in Your Space" on your mobile device to see this product in your room.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {hasAR ? (
              <Button size="lg" className="w-full">
                Add to Cart
              </Button>
            ) : (
              <>
                <Button size="lg" className="w-full" disabled>
                  AR Preview (Coming Soon)
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  3D model not yet available for this product
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Related Products</h2>
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
