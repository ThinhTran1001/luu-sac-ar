import { z } from "zod";

// --- Schemas ---
export const CreateOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const CreateOrderSchema = z.object({
  items: z
    .array(CreateOrderItemSchema)
    .min(1, "Cart must have at least one item"),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPING",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const OrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z
    .enum([
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPING",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
});

// --- Inferred Types ---
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type CreateOrderItemDto = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderQueryDto = z.infer<typeof OrderQuerySchema>;

// --- String Union ---
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

// --- Response DTOs ---
export interface OrderItemResponseDto {
  id: string;
  productId: string | null;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderResponseDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: OrderStatus;
  paymentLinkId: string | null;
  items: OrderItemResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLinkResponseDto {
  checkoutUrl: string;
  paymentLinkId: string;
}
