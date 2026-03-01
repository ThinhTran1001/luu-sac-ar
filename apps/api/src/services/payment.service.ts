import { PayOS } from '@payos/node';
import type { Webhook, WebhookData } from '@payos/node/lib/resources/webhooks/webhook';
import { OrderResponseDto, PaymentLinkResponseDto } from '@luu-sac/shared';
import { MESSAGES } from '../constants/messages';
import { AppError } from '../utils/app-error';
import { OrderService } from './order.service';
import { logger } from '../utils/logger';

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || '';
const PAYOS_API_KEY = process.env.PAYOS_API_KEY || '';
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || '';
const WEB_URL = process.env.CORS_ORIGIN || 'http://localhost:3000';

let payos: PayOS | null = null;

function getPayOS(): PayOS {
  if (!payos) {
    if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
      throw new AppError('PayOS credentials not configured', 500);
    }
    payos = new PayOS({
      clientId: PAYOS_CLIENT_ID,
      apiKey: PAYOS_API_KEY,
      checksumKey: PAYOS_CHECKSUM_KEY,
    });
  }
  return payos;
}

export class PaymentService {
  static async createPaymentLink(order: OrderResponseDto): Promise<PaymentLinkResponseDto> {
    try {
      const payosClient = getPayOS();

      // PayOS requires a numeric orderCode (use timestamp + random to avoid collision)
      const orderCode = Date.now() % 1000000000; // Keep under PayOS limit

      const paymentLink = await payosClient.paymentRequests.create({
        orderCode,
        amount: Math.round(order.totalAmount),
        description: `Đơn hàng Lưu Sắc`,
        items: order.items.map((item) => ({
          name: item.productName.substring(0, 25), // PayOS name limit
          quantity: item.quantity,
          price: Math.round(item.price),
        })),
        returnUrl: `${WEB_URL}/checkout/success`,
        cancelUrl: `${WEB_URL}/checkout/cancel`,
      });

      // Save payment reference to order
      await OrderService.updatePaymentInfo(order.id, paymentLink.paymentLinkId, String(orderCode));

      return {
        checkoutUrl: paymentLink.checkoutUrl,
        paymentLinkId: paymentLink.paymentLinkId,
      };
    } catch (error) {
      logger.error('PayOS createPaymentLink error:', error);
      throw new AppError(MESSAGES.PAYMENT.LINK_FAILED, 500);
    }
  }

  static async handleWebhook(webhookBody: Webhook): Promise<void> {
    try {
      const payosClient = getPayOS();

      // Verify webhook data
      const webhookData: WebhookData = await payosClient.webhooks.verify(webhookBody);

      const { orderCode, code } = webhookData;

      // code "00" means payment successful in PayOS
      if (code === '00' && orderCode) {
        await OrderService.markAsPaid(String(orderCode));
        logger.info(`Payment successful for orderCode: ${orderCode}`);
      } else {
        logger.warn(`Payment webhook received with code: ${code}, orderCode: ${orderCode}`);
      }
    } catch (error) {
      logger.error('PayOS webhook handling error:', error);
      throw new AppError(MESSAGES.PAYMENT.WEBHOOK_FAILED, 500);
    }
  }
}
