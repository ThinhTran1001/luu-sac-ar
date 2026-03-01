import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { API_ROUTES } from '@luu-sac/shared';
import { authenticateToken } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// BASE: /orders

// Webhook (no auth — called by PayOS server)
router.post(API_ROUTES.ORDERS.WEBHOOK, OrderController.handleWebhook);

// User routes (auth required)
router.post('/', authenticateToken, OrderController.createOrder);
router.get(API_ROUTES.ORDERS.MY, authenticateToken, OrderController.getMyOrders);

// Admin routes (auth + admin) — MUST be before /:id to avoid route conflicts
router.patch(
  API_ROUTES.ORDERS.STATUS,
  authenticateToken,
  adminMiddleware,
  OrderController.updateStatus,
);

// Generic /:id routes
router.get(API_ROUTES.ORDERS.BY_ID, authenticateToken, OrderController.getOrderById);
router.post(API_ROUTES.ORDERS.PAYMENT, authenticateToken, OrderController.createPaymentLink);

export default router;
