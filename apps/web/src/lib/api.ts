import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@luu-sac/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Custom error interface for API errors
export interface ApiError extends Error {
  errors?: Record<string, string[]>;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    const apiError = error.response?.data;
    if (apiError && !apiError.success) {
      const customError: ApiError = new Error(apiError.message);
      customError.errors = apiError.errors;
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  },
);

// Helper function to extract data from ApiResponse
export const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

// Helper function to check if response was successful
export const isSuccess = <T>(response: AxiosResponse<ApiResponse<T>>): boolean => {
  return response.data.success;
};

// Helper function to get message from response
export const getMessage = <T>(response: AxiosResponse<ApiResponse<T>>): string => {
  return response.data.message;
};
