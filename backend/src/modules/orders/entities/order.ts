import { z } from "zod";

const OrderItem = z.object({
  product: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().url().nullable(),
    price: z.number().positive(),
    category: z.string().min(1),
    created_at: z.date(),
    updated_at: z.date(),
  }),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

const Order = z.object({
  orderId: z.string().uuid(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  items: z.array(OrderItem),
  totalPrice: z.number().positive(),
  orderStatus: z.enum(["pending", "preparing", "delivering", "delivered"]),
  orderDate: z.date(),
  paymentMethod: z.enum([
    "cash",
    "credit_card",
    "debit_card",
    "paypal",
    "apple_pay",
    "google_pay",
  ]),
});

export type OrderSchema = z.infer<typeof Order>;

export { Order, OrderItem };
