import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';
import { asyncHandler } from '../utils/async-handler';
import { COOKIE_CONFIG } from '../constants/cookie';

const authService = new AuthService();

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    // Set HTTP-only cookie
    res.cookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, result.token, COOKIE_CONFIG.OPTIONS);

    // Return only user data (no token in response)
    sendSuccess(res, { user: result.user }, MESSAGES.AUTH.REGISTER_SUCCESS, 201);
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    // Set HTTP-only cookie
    res.cookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, result.token, COOKIE_CONFIG.OPTIONS);

    // Return only user data (no token in response)
    sendSuccess(res, { user: result.user }, MESSAGES.AUTH.LOGIN_SUCCESS);
  });

  static googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await authService.googleLogin(token);

    // Set HTTP-only cookie
    res.cookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, result.token, COOKIE_CONFIG.OPTIONS);

    // Return only user data (no token in response)
    sendSuccess(res, { user: result.user }, MESSAGES.AUTH.LOGIN_SUCCESS);
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

  static logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear the access token cookie
    res.clearCookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
      path: process.env.COOKIE_PATH || '/',
    });

    sendSuccess(res, null, MESSAGES.AUTH.LOGOUT_SUCCESS);
  });
}
