import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/response';
import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from '@luu-sac/shared';
import { asyncHandler } from '../utils/async-handler';
import { MESSAGES } from '../constants/messages';
import { AppError } from '../utils/app-error';

// Type definition for Multer files
interface MulterFiles {
  imageUrl?: Express.Multer.File[];
  thumbnailImage?: Express.Multer.File[];
  galleryImages?: Express.Multer.File[];
}

export class ProductController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as MulterFiles;

    const body = {
      ...req.body,
      imageUrl: files?.imageUrl?.[0]?.path,
      thumbnailImage: files?.thumbnailImage?.[0]?.path,
      galleryImages: files?.galleryImages?.map((f) => f.path) || [],
    };

    // Zod validation
    const dto = CreateProductSchema.parse(body);

    const product = await ProductService.create(dto);
    sendSuccess(res, product, MESSAGES.PRODUCT.CREATED_SUCCESS);
  });

  static findAll = asyncHandler(async (req: Request, res: Response) => {
    const query = ProductQuerySchema.parse(req.query);
    const result = await ProductService.findAll(query);
    sendSuccess(res, result, MESSAGES.PRODUCT.LIST_RETRIEVED_SUCCESS);
  });

  static findOne = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await ProductService.findOne(id);

    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    sendSuccess(res, product, MESSAGES.PRODUCT.RETRIEVED_SUCCESS);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const files = req.files as MulterFiles;

    const body = { ...req.body };

    // Only update images if new files are uploaded
    if (files?.imageUrl?.[0]) body.imageUrl = files.imageUrl[0].path;
    if (files?.thumbnailImage?.[0]) body.thumbnailImage = files.thumbnailImage[0].path;
    if (files?.galleryImages?.length) {
      body.galleryImages = files.galleryImages.map((f) => f.path);
    }

    const dto = UpdateProductSchema.parse(body);
    const product = await ProductService.update(id, dto);
    sendSuccess(res, product, MESSAGES.PRODUCT.UPDATED_SUCCESS);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await ProductService.delete(id);
    sendSuccess(res, null, MESSAGES.PRODUCT.DELETED_SUCCESS);
  });
}
