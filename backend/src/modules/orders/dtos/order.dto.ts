import { z } from "zod";
import { Order } from "../entities/order";

// DTO para criação de pedido
const CreateOrderDTO = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    }),
  ),
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

// DTO para atualização parcial de pedido
const UpdateOrderDTO = Order.partial();

export type CreateOrderType = z.infer<typeof CreateOrderDTO>;
export type UpdateOrderType = z.infer<typeof UpdateOrderDTO>;

export { CreateOrderDTO, UpdateOrderDTO };
