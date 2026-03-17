import { Prisma, ProcessingStatus } from '@prisma/client';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  PublicProductQueryDto,
} from '@luu-sac/shared';
import prisma from '../utils/prisma';
import { NotFoundException } from '../utils/app-error';
import { AI3DStudioService } from './ai3d-studio.service';

export class ProductService {
  /**
   * Create product with optional 3D model (from 3D AI Studio glbUrl or legacy imageNoBg generation)
   */
  static async create(
    dto: CreateProductDto,
    options?: { glbUrl?: string; usdzUrl?: string; imageNoBgBuffer?: Buffer },
  ) {
    const has3D = !!(options?.glbUrl || options?.imageNoBgBuffer);

    const product = await prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        imageUrl: dto.imageUrl,
        thumbnailImage: dto.thumbnailImage,
        galleryImages: dto.galleryImages,
        categoryId: dto.categoryId,
        status: dto.status,
        processingStatus: has3D ? ProcessingStatus.PROCESSING : ProcessingStatus.PENDING,
      },
    });

    // 3D AI Studio: use glbUrl + usdzUrl directly
    if (options?.glbUrl) {
      return prisma.product.update({
        where: { id: product.id },
        data: {
          glbUrl: options.glbUrl,
          usdzUrl: options.usdzUrl,
          processingStatus: 'COMPLETED',
        },
        include: { category: true },
      });
    }

    // Legacy: generate 3D from imageNoBg via 3D AI Studio
    if (options?.imageNoBgBuffer) {
      try {
        const mimeType = 'image/png';
        const imageBase64 = `data:${mimeType};base64,${options.imageNoBgBuffer.toString('base64')}`;
        const { glbUrl } = await AI3DStudioService.generateAndWait(imageBase64);

        return prisma.product.update({
          where: { id: product.id },
          data: {
            glbUrl,
            processingStatus: 'COMPLETED',
          },
          include: { category: true },
        });
      } catch (error) {
        await prisma.product.update({
          where: { id: product.id },
          data: { processingStatus: 'FAILED' },
        });
        console.error('3D generation failed:', error);
        return prisma.product.findUnique({
          where: { id: product.id },
          include: { category: true },
        });
      }
    }

    return prisma.product.findUnique({
      where: { id: product.id },
      include: { category: true },
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
      ...(status ? { status } : { status: { not: 'DELETED' } }),
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

  static async update(
    id: string,
    dto: UpdateProductDto,
    options?: { glbUrl?: string; usdzUrl?: string },
  ) {
    await this.findOne(id);

    const has3DUpdate = !!options?.glbUrl;

    return prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.thumbnailImage !== undefined && { thumbnailImage: dto.thumbnailImage }),
        ...(dto.galleryImages !== undefined && { galleryImages: dto.galleryImages }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(options?.glbUrl && { glbUrl: options.glbUrl }),
        ...(options?.usdzUrl && { usdzUrl: options.usdzUrl }),
        ...(has3DUpdate && { processingStatus: 'COMPLETED' as const }),
      },
      include: { category: true },
    });
  }

  /**
   * Finalize 3D generation: update product with GLB/USDZ URLs and set status to ACTIVE.
   */
  static async finalize3D(id: string, glbUrl: string, usdzUrl?: string) {
    await this.findOne(id);

    return prisma.product.update({
      where: { id },
      data: {
        glbUrl,
        ...(usdzUrl && { usdzUrl }),
        processingStatus: 'COMPLETED',
        status: 'ACTIVE',
      },
      include: { category: true },
    });
  }

  static async delete(id: string) {
    await this.findOne(id); // Ensure exists

    return prisma.product.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  // Public product methods (no auth required)
  static async findAllPublic(query: PublicProductQueryDto) {
    const {
      page,
      limit,
      search,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE', // CRITICAL: Only show active products
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
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

  static async findOnePublic(id: string) {
    const product = await prisma.product.findUnique({
      where: { id, status: 'ACTIVE' }, // CRITICAL: Only active products
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Fetch related products (same category, exclude current)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        status: 'ACTIVE',
        id: { not: id },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return {
      ...product,
      relatedProducts,
    };
  }
}
