import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import { API_ROUTES } from '@luu-sac/shared';

const router = Router();

router.use(API_ROUTES.AUTH.BASE, authRoutes);
router.use(API_ROUTES.CATEGORIES.BASE, categoryRoutes);
router.use(API_ROUTES.PRODUCTS.BASE, productRoutes);

export default router;
