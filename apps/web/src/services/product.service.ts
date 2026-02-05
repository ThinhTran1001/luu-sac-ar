import { api, extractData } from '../lib/api';
import {
  API_ROUTES,
  ApiResponse,
  ProductDto,
  ProductQueryDto,
  CreateProductDto,
  UpdateProductDto,
  PublicProductQueryDto,
  PublicProductDto,
  PublicProductDetailDto,
} from '@luu-sac/shared';

interface ProductListResponse {
  data: ProductDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PublicProductListResponse {
  data: PublicProductDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productService = {
  findAll: async (
    query: ProductQueryDto = { page: 1, limit: 10 },
  ): Promise<ProductListResponse> => {
    const response = await api.get<ApiResponse<ProductDto[]>>(API_ROUTES.PRODUCTS.BASE, {
      params: query,
    });
    return {
      data: extractData(response),
      meta: response.data.meta!,
    };
  },

  findOne: async (id: string): Promise<ProductDto> => {
    const response = await api.get<ApiResponse<ProductDto>>(
      API_ROUTES.PRODUCTS.BY_ID.replace(':id', id),
    );
    return extractData(response);
  },

  // Accepts FormData because of file uploads
  create: async (formData: FormData): Promise<ProductDto> => {
    const response = await api.post<ApiResponse<ProductDto>>(API_ROUTES.PRODUCTS.BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractData(response);
  },

  update: async (id: string, formData: FormData): Promise<ProductDto> => {
    const response = await api.put<ApiResponse<ProductDto>>(
      API_ROUTES.PRODUCTS.BY_ID.replace(':id', id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return extractData(response);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.PRODUCTS.BY_ID.replace(':id', id));
  },

  // Public product methods (no auth required)
  findAllPublic: async (
    query: PublicProductQueryDto = { page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc' },
  ): Promise<PublicProductListResponse> => {
    const response = await api.get<ApiResponse<PublicProductDto[]>>(
      `${API_ROUTES.PRODUCTS.BASE}/public`,
      { params: query },
    );
    return {
      data: extractData(response),
      meta: response.data.meta!,
    };
  },

  findOnePublic: async (id: string): Promise<PublicProductDetailDto> => {
    const response = await api.get<ApiResponse<PublicProductDetailDto>>(
      `${API_ROUTES.PRODUCTS.BASE}/public/${id}`,
    );
    return extractData(response);
  },
};
