import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import ai3dRoutes from './ai3d.routes';
import { API_ROUTES } from '@luu-sac/shared';

const router = Router();

router.use(API_ROUTES.AUTH.BASE, authRoutes);
router.use(API_ROUTES.CATEGORIES.BASE, categoryRoutes);
router.use(API_ROUTES.PRODUCTS.BASE, productRoutes);
router.use(API_ROUTES.ORDERS.BASE, orderRoutes);
router.use(API_ROUTES.AI3D.BASE, ai3dRoutes);

export default router;
