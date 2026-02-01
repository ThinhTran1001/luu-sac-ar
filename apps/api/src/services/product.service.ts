import { Prisma } from '@prisma/client';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '@luu-sac/shared';
import prisma from '../utils/prisma';
import { NotFoundException } from '../utils/app-error';

export class ProductService {
  static async create(dto: CreateProductDto) {
    return prisma.product.create({
      data: dto,
    });
  }

  static async findAll(query: ProductQueryDto) {
    const {
      page,
      limit,
      search,
      categoryId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' } }],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findOne(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  static async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id); // Ensure exists

    return prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  static async delete(id: string) {
    await this.findOne(id); // Ensure exists

    return prisma.product.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }
}
