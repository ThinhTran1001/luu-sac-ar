import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { PublicProductQueryDto } from '@luu-sac/shared';

export const usePublicProducts = (query: PublicProductQueryDto) => {
  return useQuery({
    queryKey: ['products', 'public', query],
    queryFn: () => productService.findAllPublic(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};
