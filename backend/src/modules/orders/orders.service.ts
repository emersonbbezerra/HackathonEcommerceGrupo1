import { PrismaClient } from "@prisma/client";
import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { CreateOrderType, UpdateOrderType } from "./dtos/order.dto";
import { OrderSchema } from "./entities/order";

export interface IOrdersService {
  findAll(): Promise<OrderSchema[]>;
  create(data: CreateOrderType): Promise<OrderSchema | ServerError>;
  getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<OrderSchema | null>;
  update(id: string, data: UpdateOrderType): Promise<OrderSchema | null>;
  delete(id: string): Promise<boolean>;
}

class OrdersService implements IOrdersService {
  prisma: PrismaClient | typeof prismaMock;

  constructor(prisma?: typeof prismaMock) {
    this.prisma = prisma || new PrismaClient();
  }

  async findAll(): Promise<OrderSchema[]> {
    return this.prisma.order.findMany({ include: { items: true } });
  }

  async create(data: CreateOrderType): Promise<OrderSchema | ServerError> {
    try {
      const order = await this.prisma.order.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          items: {
            create: data.items.map((item) => ({
              product: { connect: { id: item.product } },
              quantity: item.quantity,
              price: item.price,
            })),
          },
          totalPrice: data.totalPrice,
          orderStatus: data.orderStatus,
          orderDate: data.orderDate,
          paymentMethod: data.paymentMethod,
        },
        include: { items: true },
      });

      return order;
    } catch (error) {
      return new ServerError();
    }
  }

  async getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<OrderSchema | null> {
    return this.prisma.order.findFirst({
      where: { [field]: value },
      include: { items: true },
    });
  }

  async update(id: string, data: UpdateOrderType): Promise<OrderSchema | null> {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data: {
          ...data,
          items: data.items
            ? {
                updateMany: data.items.map((item) => ({
                  where: { productId: item.product },
                  data: { quantity: item.quantity, price: item.price },
                })),
              }
            : undefined,
        },
        include: { items: true },
      });

      return order;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export { OrdersService };
