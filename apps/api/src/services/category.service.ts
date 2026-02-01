import { CreateCategoryDto, UpdateCategoryDto } from '@luu-sac/shared';
import prisma from '../utils/prisma';
import { NotFoundException } from '../utils/app-error';

export class CategoryService {
  static async create(dto: CreateCategoryDto) {
    return prisma.category.create({
      data: dto,
    });
  }

  static async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  static async findOne(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  static async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id); // Ensure exists

    return prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  static async delete(id: string) {
    await this.findOne(id); // Ensure exists

    return prisma.category.delete({
      where: { id },
    });
  }
}
