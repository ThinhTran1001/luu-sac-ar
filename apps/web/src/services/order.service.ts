import { api, extractData } from '../lib/api';
import {
  ApiResponse,
  OrderResponseDto,
  CreateOrderDto,
  PaymentLinkResponseDto,
  UpdateOrderStatusDto,
  API_ROUTES,
  PaginationMeta,
} from '@luu-sac/shared';

interface PaginatedOrdersResponse {
  data: OrderResponseDto[];
  meta: PaginationMeta;
}

export const orderService = {
  createOrder: async (dto: CreateOrderDto): Promise<OrderResponseDto> => {
    const response = await api.post<ApiResponse<OrderResponseDto>>(
      `${API_ROUTES.ORDERS.BASE}`,
      dto,
    );
    return extractData(response);
  },

  getMyOrders: async (page = 1, limit = 10, status?: string): Promise<PaginatedOrdersResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<OrderResponseDto[]>>(
      `${API_ROUTES.ORDERS.BASE}${API_ROUTES.ORDERS.MY}?${params.toString()}`,
    );
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getOrderById: async (id: string): Promise<OrderResponseDto> => {
    const response = await api.get<ApiResponse<OrderResponseDto>>(
      `${API_ROUTES.ORDERS.BASE}/${id}`,
    );
    return extractData(response);
  },

  createPaymentLink: async (orderId: string): Promise<PaymentLinkResponseDto> => {
    const response = await api.post<ApiResponse<PaymentLinkResponseDto>>(
      `${API_ROUTES.ORDERS.BASE}/${orderId}/payment`,
    );
    return extractData(response);
  },

  // Admin
  getAllOrders: async (page = 1, limit = 10, status?: string): Promise<PaginatedOrdersResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<OrderResponseDto[]>>(
      `${API_ROUTES.ORDERS.BASE}?${params.toString()}`,
    );
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  updateOrderStatus: async (id: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> => {
    const response = await api.patch<ApiResponse<OrderResponseDto>>(
      `${API_ROUTES.ORDERS.BASE}/${id}/status`,
      dto,
    );
    return extractData(response);
  },
};
