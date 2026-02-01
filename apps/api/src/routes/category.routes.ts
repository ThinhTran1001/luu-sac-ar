import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { API_ROUTES } from '@luu-sac/shared';

const router = Router();

// BASE: /categories

router.post('/', CategoryController.create);

router.get('/', CategoryController.findAll);

router.get(API_ROUTES.CATEGORIES.BY_ID, CategoryController.findOne);

router.put(API_ROUTES.CATEGORIES.BY_ID, CategoryController.update);

router.delete(API_ROUTES.CATEGORIES.BY_ID, CategoryController.delete);

export default router;
