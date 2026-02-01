import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { MESSAGES } from '../constants/messages';
import { COOKIE_CONFIG } from '../constants/cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface UserPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Read token from cookie instead of Authorization header
  const token = req.cookies[COOKIE_CONFIG.ACCESS_TOKEN_NAME];

  if (!token) {
    return res.status(401).json({ message: MESSAGES.AUTH.ACCESS_TOKEN_REQUIRED });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (err) {
        return res.status(403).json({ message: MESSAGES.AUTH.INVALID_TOKEN });
      }

      if (typeof user === 'string' || !user) {
        return res.status(403).json({ message: MESSAGES.AUTH.INVALID_TOKEN_PAYLOAD });
      }

      req.user = user as UserPayload;
      next();
    },
  );
};
