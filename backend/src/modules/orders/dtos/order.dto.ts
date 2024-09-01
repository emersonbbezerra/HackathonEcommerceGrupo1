import { z } from "zod";

// DTO para criação de pedido
const CreateOrderDTO = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  items: z.array(
    z.object({
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
const UpdateOrderDTO = z.object({
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerAddress: z.string().min(1).optional(),
  items: z
    .array(
      z.object({
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
      }),
    )
    .optional(),
  totalPrice: z.number().positive().optional(),
  orderStatus: z
    .enum(["pending", "preparing", "delivering", "delivered"])
    .optional(),
  orderDate: z.date().optional(),
  paymentMethod: z
    .enum([
      "cash",
      "credit_card",
      "debit_card",
      "paypal",
      "apple_pay",
      "google_pay",
    ])
    .optional(),
});

export type CreateOrderType = z.infer<typeof CreateOrderDTO>;
export type UpdateOrderType = z.infer<typeof UpdateOrderDTO>;

export { CreateOrderDTO, UpdateOrderDTO };
