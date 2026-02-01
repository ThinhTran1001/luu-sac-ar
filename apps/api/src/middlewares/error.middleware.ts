import { Request, Response, NextFunction } from 'express';
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

  if (err instanceof Error) {
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
