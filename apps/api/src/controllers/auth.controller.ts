import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { MESSAGES } from '../constants/messages';

const authService = new AuthService();

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, MESSAGES.AUTH.REGISTER_SUCCESS, 201);
    } catch (error: unknown) {
      sendError(res, getErrorMessage(error), 400);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, MESSAGES.AUTH.LOGIN_SUCCESS);
    } catch (error: unknown) {
      sendError(res, getErrorMessage(error), 401);
    }
  }

  static async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const result = await authService.googleLogin(token);
      sendSuccess(res, result, MESSAGES.AUTH.LOGIN_SUCCESS);
    } catch (error: unknown) {
      sendError(res, getErrorMessage(error), 401);
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      sendSuccess(res, result, MESSAGES.AUTH.RESET_EMAIL_SENT);
    } catch (error: unknown) {
      sendError(res, getErrorMessage(error), 400);
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.resetPassword(req.body);
      sendSuccess(res, result, MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFUL);
    } catch (error: unknown) {
      sendError(res, getErrorMessage(error), 400);
    }
  }
}
