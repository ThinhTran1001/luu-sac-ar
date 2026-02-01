import { CreateCategoryDto, UpdateCategoryDto } from '@luu-sac/shared';
import prisma from '../utils/prisma';

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
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  static async update(id: string, dto: UpdateCategoryDto) {
    return prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}
