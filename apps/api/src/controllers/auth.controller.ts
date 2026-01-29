import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';
import { asyncHandler } from '../utils/async-handler';

const authService = new AuthService();

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, MESSAGES.AUTH.REGISTER_SUCCESS, 201);
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, MESSAGES.AUTH.LOGIN_SUCCESS);
  });

  static googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await authService.googleLogin(token);
    sendSuccess(res, result, MESSAGES.AUTH.LOGIN_SUCCESS);
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    sendSuccess(res, result, MESSAGES.AUTH.RESET_EMAIL_SENT);
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resetPassword(req.body);
    sendSuccess(res, result, MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFUL);
  });
}
