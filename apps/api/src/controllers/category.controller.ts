import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { sendSuccess } from '../utils/response';
import { CreateCategorySchema, UpdateCategorySchema } from '@luu-sac/shared';
import { asyncHandler } from '../utils/async-handler';
import { MESSAGES } from '../constants/messages';
import { AppError } from '../utils/app-error';

export class CategoryController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const dto = CreateCategorySchema.parse(req.body);
    const category = await CategoryService.create(dto);
    sendSuccess(res, category, MESSAGES.CATEGORY.CREATED_SUCCESS);
  });

  static findAll = asyncHandler(async (req: Request, res: Response) => {
    const categories = await CategoryService.findAll();
    sendSuccess(res, categories, MESSAGES.CATEGORY.LIST_RETRIEVED_SUCCESS);
  });

  static findOne = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const category = await CategoryService.findOne(id);
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
    }
    sendSuccess(res, category, MESSAGES.CATEGORY.RETRIEVED_SUCCESS);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const dto = UpdateCategorySchema.parse(req.body);
    const category = await CategoryService.update(id, dto);
    sendSuccess(res, category, MESSAGES.CATEGORY.UPDATED_SUCCESS);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await CategoryService.delete(id);
    sendSuccess(res, null, MESSAGES.CATEGORY.DELETED_SUCCESS);
  });
}
