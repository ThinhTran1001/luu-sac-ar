import { z } from "zod";

export const ProductStatusSchema = z.enum(["ACTIVE", "HIDE", "DELETED"]);

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number().int(),
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
