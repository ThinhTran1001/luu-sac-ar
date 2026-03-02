import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { AppError } from '../utils/app-error';
import { sendError } from '../utils/response';
import { MESSAGES } from '../constants/messages';
import { logger } from '../utils/logger';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  const meta = {
    method: req.method,
    url: req.url,
    body: req.method !== 'GET' ? req.body : undefined,
  };

  if (err instanceof AppError) {
    logger.warn(`OPERATIONAL ERROR: ${err.message}`, { ...meta, statusCode: err.statusCode });
    return sendError(res, err.message, err.statusCode);
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? MESSAGES.PRODUCT.UPLOAD_FILE_TOO_LARGE
        : err.code === 'LIMIT_FILE_COUNT'
          ? MESSAGES.PRODUCT.UPLOAD_TOO_MANY_FILES
          : err.message;
    logger.warn(`UPLOAD ERROR: ${err.code}`, { ...meta, statusCode: 413 });
    return sendError(res, message, 413);
  }

  if (err instanceof ZodError) {
    const first = err.errors[0];
    const message = first
      ? `${first.path.join('.')}: ${first.message}`
      : 'Dữ liệu không hợp lệ';
    logger.warn(`VALIDATION ERROR: ${message}`, { ...meta, statusCode: 400, errors: err.errors });
    return sendError(res, message, 400);
  }

  if (err instanceof Error) {
    if (err.message.includes('Định dạng ảnh không hợp lệ')) {
      logger.warn(`UPLOAD FORMAT ERROR: ${err.message}`, { ...meta, statusCode: 400 });
      return sendError(res, err.message, 400);
    }
    logger.error(`INTERNAL SERVER ERROR: ${err.message}`, {
      ...meta,
      statusCode: 500,
      stack: err.stack,
    });
    return sendError(res, err.message, 500);
  }

  // Fallback for unknown errors
  logger.error('UNKNOWN CRITICAL ERROR', { ...meta, statusCode: 500, error: err });
  return sendError(res, MESSAGES.ERROR.DEFAULT, 500);
};
