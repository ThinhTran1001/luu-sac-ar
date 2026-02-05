import { z } from "zod";
import { ProductSchema } from "./product.schema";
import { CategorySchema } from "./category.dto";

// Public product DTO - includes category info
export const PublicProductSchema = ProductSchema.extend({
  category: CategorySchema,
});

export type PublicProductDto = z.infer<typeof PublicProductSchema>;

// Product detail with related products
export const PublicProductDetailSchema = PublicProductSchema.extend({
  relatedProducts: z.array(PublicProductSchema),
});

export type PublicProductDetailDto = z.infer<typeof PublicProductDetailSchema>;

// Public query schema (no status filter for users)
export const PublicProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  sortBy: z.enum(["price", "createdAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export type PublicProductQueryDto = z.infer<typeof PublicProductQuerySchema>;
