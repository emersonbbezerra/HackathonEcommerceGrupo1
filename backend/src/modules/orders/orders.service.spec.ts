import { OrdersService } from "@/modules/orders/orders.service";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import {
  CreateOrderType,
  UpdateOrderType,
} from "@/modules/orders/dtos/order.dto";
import { OrderSchema } from "@/modules/orders/entities/order";
import { ServerError } from "@/common/errors/server-error";

const ordersService = new OrdersService(prismaMock);

describe("OrdersService", () => {
  describe("create", () => {
    it("should successfully create an order", async () => {
      const createOrderData: CreateOrderType = {
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "123 Elm Street",
        items: [
          {
            product: {
              id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
              name: "Sample Product",
              description: "Sample description",
              image: "http://example.com/image.jpg",
              price: 59.99,
              category: "Sample Category",
              created_at: new Date(),
              updated_at: new Date(),
            },
            quantity: 1,
            price: 59.99,
          },
        ],
        totalPrice: 59.99,
        orderStatus: "pending",
        orderDate: new Date("2024-08-30T19:30:57.510Z"),
        paymentMethod: "credit_card",
      };

      const createdOrder: OrderSchema = {
        orderId: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "123 Elm Street",
        items: [
          {
            product: {
              id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
              name: "Sample Product",
              description: "Sample description",
              image: "http://example.com/image.jpg",
              price: 59.99,
              category: "Sample Category",
              created_at: new Date(),
              updated_at: new Date(),
            },
            quantity: 1,
            price: 59.99,
          },
        ],
        totalPrice: 59.99,
        orderStatus: "pending",
        orderDate: new Date("2024-08-30T19:30:57.510Z"),
        paymentMethod: "credit_card",
      };

      prismaMock.order.create.mockResolvedValueOnce(createdOrder);

      const result = await ordersService.create(createOrderData);

      expect(result).toEqual(createdOrder);
    });

    it("should return ServerError when creation fails", async () => {
      const createOrderData: CreateOrderType = {
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "123 Elm Street",
        items: [
          {
            product: {
              id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
              name: "Sample Product",
              description: "Sample description",
              image: "http://example.com/image.jpg",
              price: 59.99,
              category: "Sample Category",
              created_at: new Date(),
              updated_at: new Date(),
            },
            quantity: 1,
            price: 59.99,
          },
        ],
        totalPrice: 59.99,
        orderStatus: "pending",
        orderDate: new Date("2024-08-30T19:30:57.510Z"),
        paymentMethod: "credit_card",
      };

      prismaMock.order.create.mockRejectedValueOnce(
        new Error("Creation failed"),
      );

      const result = await ordersService.create(createOrderData);

      expect(result).toBeInstanceOf(ServerError);
    });
  });

  describe("findAll", () => {
    it("should return a list of orders", async () => {
      const ordersList: OrderSchema[] = [
        {
          orderId: "d426bcf6-8536-41f3-91ba-c39c581554e2",
          customerName: "John Doe",
          customerPhone: "1234567890",
          customerAddress: "123 Elm Street",
          items: [],
          totalPrice: 59.99,
          orderStatus: "pending",
          orderDate: new Date("2024-08-30T19:30:57.510Z"),
          paymentMethod: "credit_card",
        },
      ];

      prismaMock.order.findMany.mockResolvedValueOnce(ordersList);

      const result = await ordersService.findAll();

      expect(result).toEqual(ordersList);
    });
  });

  describe("getByUnique", () => {
    it("should return an order by a unique field", async () => {
      const order: OrderSchema = {
        orderId: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "123 Elm Street",
        items: [],
        totalPrice: 59.99,
        orderStatus: "pending",
        orderDate: new Date("2024-08-30T19:30:57.510Z"),
        paymentMethod: "credit_card",
      };

      prismaMock.order.findFirst.mockResolvedValueOnce(order);

      const result = await ordersService.getByUnique({
        field: "orderId",
        value: "d426bcf6-8536-41f3-91ba-c39c581554e2",
      });

      expect(result).toEqual(order);
    });
  });

  describe("update", () => {
    it("should successfully update an order", async () => {
      const updateOrderData: UpdateOrderType = {
        customerName: "Jane Doe",
        items: [
          {
            product: {
              id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
              name: "Updated Product",
              description: "Updated description",
              image: "http://example.com/image-updated.jpg",
              price: 49.99,
              category: "Updated Category",
              created_at: new Date(),
              updated_at: new Date(),
            },
            quantity: 2,
            price: 49.99,
          },
        ],
        totalPrice: 99.98,
        orderStatus: "preparing",
        paymentMethod: "paypal",
      };

      const updatedOrder: OrderSchema = {
        orderId: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        customerName: "Jane Doe",
        customerPhone: "1234567890",
        customerAddress: "123 Elm Street",
        items: [],
        totalPrice: 99.98,
        orderStatus: "preparing",
        orderDate: new Date("2024-08-30T19:30:57.510Z"),
        paymentMethod: "paypal",
      };

      prismaMock.order.update.mockResolvedValueOnce(updatedOrder);

      const result = await ordersService.update(
        "d426bcf6-8536-41f3-91ba-c39c581554e2",
        updateOrderData,
      );

      expect(result).toEqual(updatedOrder);
    });

    it("should return null if update fails", async () => {
      prismaMock.order.update.mockRejectedValueOnce(new Error("Update failed"));

      const result = await ordersService.update(
        "d426bcf6-8536-41f3-91ba-c39c581554e2",
        {},
      );

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should successfully delete an order", async () => {
      prismaMock.order.delete.mockResolvedValueOnce({} as any);

      const result = await ordersService.delete(
        "d426bcf6-8536-41f3-91ba-c39c581554e2",
      );

      expect(result).toBe(true);
    });

    it("should return false when deletion fails", async () => {
      prismaMock.order.delete.mockRejectedValueOnce(
        new Error("Deletion failed"),
      );

      const result = await ordersService.delete(
        "d426bcf6-8536-41f3-91ba-c39c581554e2",
      );

      expect(result).toBe(false);
    });
  });
});
