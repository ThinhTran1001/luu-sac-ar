import { Response } from 'express';
import { ApiResponse } from '@luu-sac/shared';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: Record<string, string[]>,
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
  };
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number },
  message: string = 'Success',
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
  res.status(200).json(response);
};
