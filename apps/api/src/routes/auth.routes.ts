import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { API_ROUTES } from '@luu-sac/shared';

const router = Router();

router.post(API_ROUTES.AUTH.REGISTER, AuthController.register);
router.post(API_ROUTES.AUTH.LOGIN, AuthController.login);
router.post(API_ROUTES.AUTH.GOOGLE, AuthController.googleLogin);
router.post(API_ROUTES.AUTH.FORGOT_PASSWORD, AuthController.forgotPassword);
router.post(API_ROUTES.AUTH.RESET_PASSWORD, AuthController.resetPassword);

export default router;
