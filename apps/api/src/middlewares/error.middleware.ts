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
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  if (err instanceof Error) {
    logger.error(`ERROR ${err.message}`, { stack: err.stack });
    return sendError(res, err.message, 500);
  }

  // Fallback for unknown errors
  logger.error('UNKNOWN ERROR', { error: err });
  return sendError(res, MESSAGES.ERROR.DEFAULT, 500);
};
