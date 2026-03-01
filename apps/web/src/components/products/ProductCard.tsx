'use client';

import { PublicProductDto } from '@luu-sac/shared';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface ProductCardProps {
  product: PublicProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={ROUTES.PRODUCTS.DETAIL(product.id)}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnailImage || product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
          <Badge className="absolute top-2 right-2">{product.category.name}</Badge>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link href={ROUTES.PRODUCTS.DETAIL(product.id)}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {product.description}
        </p>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={ROUTES.PRODUCTS.DETAIL(product.id)}>Xem Chi Tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
