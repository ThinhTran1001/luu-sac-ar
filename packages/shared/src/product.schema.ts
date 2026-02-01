import { z } from "zod";

export const ProductStatusSchema = z.enum(["ACTIVE", "HIDE", "DELETED"]);

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number().int(),
  imageUrl: z.string().url(),
  thumbnailImage: z.string().url().optional().nullable(),
  galleryImages: z.array(z.string().url()),
  glbUrl: z.string().url().optional().nullable(),
  status: ProductStatusSchema,
  categoryId: z.string().uuid(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type ProductDto = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: ProductStatusSchema.optional(),
  sortBy: z.enum(["price", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type ProductQueryDto = z.infer<typeof ProductQuerySchema>;
