import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export const usePublicProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['products', 'public', id],
    queryFn: () => productService.findOnePublic(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only fetch when ID exists
  });
};
