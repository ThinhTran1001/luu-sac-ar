import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
});

export type CategoryDto = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
