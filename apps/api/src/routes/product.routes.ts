import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { API_ROUTES } from '@luu-sac/shared';
import { upload } from '../services/upload.service';

const router = Router();

// BASE: /products

// Public routes (no auth required) - MUST be before authenticated routes
router.get('/public', ProductController.findAllPublic);
router.get('/public/:id', ProductController.findOnePublic);

// Admin routes (auth required via middleware in main app)
router.post(
  '/',
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  ProductController.create,
);

router.get('/', ProductController.findAll);

router.get(API_ROUTES.PRODUCTS.BY_ID, ProductController.findOne);

router.put(
  API_ROUTES.PRODUCTS.BY_ID,
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  ProductController.update,
);

router.delete(API_ROUTES.PRODUCTS.BY_ID, ProductController.delete);

export default router;
