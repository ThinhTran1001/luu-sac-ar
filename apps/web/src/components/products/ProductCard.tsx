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
    <Card className="group overflow-hidden transition-all hover:shadow-md rounded-2xl border-[var(--border)] bg-[var(--card)]">
      <Link href={ROUTES.PRODUCTS.DETAIL(product.id)}>
        <div className="relative aspect-square overflow-hidden rounded-t-2xl">
          <Image
            src={product.thumbnailImage || product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
          <Badge className="absolute top-3 right-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] border-0">
            {product.category.name}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link href={ROUTES.PRODUCTS.DETAIL(product.id)}>
          <h3 className="font-semibold text-[var(--foreground)] line-clamp-1 hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <p className="text-xl font-bold text-[var(--primary)]">${product.price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full rounded-xl font-semibold">
          <Link href={ROUTES.PRODUCTS.DETAIL(product.id)}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
