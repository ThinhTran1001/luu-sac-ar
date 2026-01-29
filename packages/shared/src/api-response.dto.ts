// API Response Wrapper (Standard for ALL endpoints)

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ApiErrorResponse = ApiResponse<null>;

export type ApiSuccessResponse<T> = ApiResponse<T> & { success: true };
