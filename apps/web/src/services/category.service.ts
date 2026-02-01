import { api, extractData } from '../lib/api';
import {
  API_ROUTES,
  ApiResponse,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@luu-sac/shared';

export const categoryService = {
  findAll: async (): Promise<CategoryDto[]> => {
    const response = await api.get<ApiResponse<CategoryDto[]>>(API_ROUTES.CATEGORIES.BASE);
    return extractData(response);
  },

  findOne: async (id: string): Promise<CategoryDto> => {
    const response = await api.get<ApiResponse<CategoryDto>>(
      API_ROUTES.CATEGORIES.BY_ID.replace(':id', id),
    );
    return extractData(response);
  },

  create: async (dto: CreateCategoryDto): Promise<CategoryDto> => {
    const response = await api.post<ApiResponse<CategoryDto>>(API_ROUTES.CATEGORIES.BASE, dto);
    return extractData(response);
  },

  update: async (id: string, dto: UpdateCategoryDto): Promise<CategoryDto> => {
    const response = await api.put<ApiResponse<CategoryDto>>(
      API_ROUTES.CATEGORIES.BY_ID.replace(':id', id),
      dto,
    );
    return extractData(response);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.CATEGORIES.BY_ID.replace(':id', id));
  },
};
