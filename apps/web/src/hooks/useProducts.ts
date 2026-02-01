import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { ProductQueryDto } from '@luu-sac/shared';

export function useProducts(query: ProductQueryDto) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => productService.findAll(query),
    placeholderData: (previousData) => previousData,
  });
}
