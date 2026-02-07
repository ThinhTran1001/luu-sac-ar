import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/app-error';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  next();
};
