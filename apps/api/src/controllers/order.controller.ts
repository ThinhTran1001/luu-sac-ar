import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { CreateOrderSchema, OrderQuerySchema, UpdateOrderStatusSchema } from '@luu-sac/shared';
import { asyncHandler } from '../utils/async-handler';
import { MESSAGES } from '../constants/messages';
import { AuthRequest } from '../middlewares/auth.middleware';

export class OrderController {
  // POST /orders — Create order from cart items
  static createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const dto = CreateOrderSchema.parse(req.body);
    const order = await OrderService.createOrder(userId, dto);
    sendSuccess(res, order, MESSAGES.ORDER.CREATED_SUCCESS, 201);
  });

  // GET /orders/my — Get current user's orders
  static getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { page, limit, status } = OrderQuerySchema.parse(req.query);
    const { orders, total } = await OrderService.getMyOrders(userId, page, limit, status);
    sendPaginated(res, orders, { page, limit, total }, MESSAGES.ORDER.LIST_RETRIEVED_SUCCESS);
  });

  // GET /orders/:id — Get single order detail
  static getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'ADMIN';

    // Admin can view any order; user can only view their own
    const order = await OrderService.getOrderById(orderId, isAdmin ? undefined : userId);
    sendSuccess(res, order, MESSAGES.ORDER.RETRIEVED_SUCCESS);
  });

  // POST /orders/:id/payment — Create PayOS payment link
  static createPaymentLink = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const userId = req.user!.userId;

    // Get order and verify ownership
    const order = await OrderService.getOrderById(orderId, userId);
    const paymentLink = await PaymentService.createPaymentLink(order);
    sendSuccess(res, paymentLink, MESSAGES.PAYMENT.LINK_CREATED);
  });

  // POST /orders/payment/webhook — PayOS webhook callback
  static handleWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
    await PaymentService.handleWebhook(req.body);
    sendSuccess(res, null, MESSAGES.PAYMENT.WEBHOOK_SUCCESS);
  });

  // GET /orders — Admin: get all orders
  static getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, status } = OrderQuerySchema.parse(req.query);
    const { orders, total } = await OrderService.getAllOrders(page, limit, status);
    sendPaginated(res, orders, { page, limit, total }, MESSAGES.ORDER.LIST_RETRIEVED_SUCCESS);
  });

  // PATCH /orders/:id/status — Admin: update order status
  static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const { status } = UpdateOrderStatusSchema.parse(req.body);
    const order = await OrderService.updateOrderStatus(orderId, status);
    sendSuccess(res, order, MESSAGES.ORDER.UPDATED_SUCCESS);
  });
}
