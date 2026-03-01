import prisma from '../utils/prisma';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderItemResponseDto,
  OrderStatus,
} from '@luu-sac/shared';
import { MESSAGES } from '../constants/messages';
import { AppError, NotFoundException, BadRequestException } from '../utils/app-error';

interface OrderWithRelations {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentLinkId: string | null;
  paymentReference: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string; email: string };
  items: Array<{
    id: string;
    productId: string | null;
    price: number;
    quantity: number;
    product: { name: string; imageUrl: string } | null;
  }>;
}

function mapOrderToResponse(order: OrderWithRelations): OrderResponseDto {
  return {
    id: order.id,
    userId: order.userId,
    userName: order.user.name,
    userEmail: order.user.email,
    totalAmount: order.totalAmount,
    status: order.status as OrderStatus,
    paymentLinkId: order.paymentLinkId,
    items: order.items.map(
      (item): OrderItemResponseDto => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.name ?? 'Deleted Product',
        productImage: item.product?.imageUrl ?? '',
        price: item.price,
        quantity: item.quantity,
      }),
    ),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

const orderInclude = {
  user: { select: { name: true, email: true } },
  items: {
    include: {
      product: { select: { name: true, imageUrl: true } },
    },
  },
};

export class OrderService {
  static async createOrder(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
    // Fetch all products and validate stock
    const productIds = dto.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(MESSAGES.ORDER.PRODUCT_NOT_FOUND);
    }

    // Validate stock
    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        throw new BadRequestException(
          `${MESSAGES.ORDER.INSUFFICIENT_STOCK}: ${product?.name ?? item.productId}`,
        );
      }
    }

    // Calculate total
    const totalAmount = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      // Create order with items
      return tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          items: {
            create: dto.items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                price: product.price,
                quantity: item.quantity,
              };
            }),
          },
        },
        include: orderInclude,
      });
    });

    return mapOrderToResponse(order as OrderWithRelations);
  }

  static async getMyOrders(
    userId: string,
    page: number,
    limit: number,
    status?: OrderStatus,
  ): Promise<{ orders: OrderResponseDto[]; total: number }> {
    const where = {
      userId,
      ...(status ? { status } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders: (orders as OrderWithRelations[]).map(mapOrderToResponse),
      total,
    };
  }

  static async getOrderById(orderId: string, userId?: string): Promise<OrderResponseDto> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    // If userId provided, verify ownership
    if (userId && order.userId !== userId) {
      throw new AppError(MESSAGES.ORDER.UNAUTHORIZED, 403);
    }

    return mapOrderToResponse(order as OrderWithRelations);
  }

  static async getAllOrders(
    page: number,
    limit: number,
    status?: OrderStatus,
  ): Promise<{ orders: OrderResponseDto[]; total: number }> {
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders: (orders as OrderWithRelations[]).map(mapOrderToResponse),
      total,
    };
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderResponseDto> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: orderInclude,
    });

    return mapOrderToResponse(updated as OrderWithRelations);
  }

  static async updatePaymentInfo(
    orderId: string,
    paymentLinkId: string,
    paymentReference?: string,
  ): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentLinkId, paymentReference },
    });
  }

  static async markAsPaid(paymentReference: string): Promise<void> {
    // PayOS sends orderCode as reference — find order by paymentReference
    const order = await prisma.order.findFirst({
      where: { paymentReference },
    });

    if (!order) {
      throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });
  }
}
