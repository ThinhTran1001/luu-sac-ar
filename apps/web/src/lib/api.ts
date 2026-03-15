import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@luu-sac/shared';

// Production (Netlify, etc.): set NEXT_PUBLIC_API_URL to backend root including /api (e.g. https://luu-sac-api.onrender.com/api).
// Dev: /api so Next.js rewrites proxy to local backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Custom error interface for API errors
export interface ApiError extends Error {
  errors?: Record<string, string[]>;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Include cookies in requests
});

// Request interceptor - Token is automatically sent via cookie
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No need to manually add Authorization header
    // Token is automatically included via HTTP-only cookie
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
