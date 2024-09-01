import { OrdersService } from "./orders.service";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { CreateOrderType, UpdateOrderType } from "./dtos/order.dto";
import { OrderSchema } from "./entities/order";

const ordersService = new OrdersService(prismaMock);

describe("OrdersService", () => {
  // Mock data
  const mockOrderData: CreateOrderType = {
    customerName: "John Doe",
    customerPhone: "1234567890",
    customerAddress: "123 Elm Street",
    items: [
      {
        product: {
          id: "uuid-1",
          name: "Pizza",
          description: "Delicious pizza",
          image: "http://example.com/pizza.jpg",
          price: 12.99,
          category: "food",
          created_at: new Date(),
          updated_at: new Date(),
        },
        quantity: 2,
        price: 12.99,
      },
    ],
    totalPrice: 25.98,
    orderStatus: "pending",
    orderDate: new Date(),
    paymentMethod: "cash",
  };

  const mockOrder: OrderSchema = {
    orderId: "uuid-1",
    customerName: "John Doe",
    customerPhone: "1234567890",
    customerAddress: "123 Elm Street",
    items: mockOrderData.items,
    totalPrice: 25.98,
    orderStatus: "pending",
    orderDate: new Date(),
    paymentMethod: "cash",
  };

  describe("findAll", () => {
    it("should return a list of orders", async () => {
      prismaMock.order.findMany.mockResolvedValue([mockOrder]);

      const orders = await ordersService.findAll();

      expect(orders).toEqual([mockOrder]);
    });
  });

  describe("create", () => {
    it("should successfully create an order", async () => {
      prismaMock.order.create.mockResolvedValue(mockOrder);

      const createdOrder = await ordersService.create(mockOrderData);

      expect(createdOrder).toEqual(mockOrder);
    });

    it("should handle error when creation fails", async () => {
      prismaMock.order.create.mockRejectedValue(new Error("Creation failed"));

      await expect(ordersService.create(mockOrderData)).rejects.toThrow(
        "Creation failed",
      );
    });
  });

  describe("getByUnique", () => {
    it("should return an order by a unique field", async () => {
      prismaMock.order.findFirst.mockResolvedValue(mockOrder);

      const order = await ordersService.getByUnique({
        field: "orderId",
        value: "uuid-1",
      });

      expect(order).toEqual(mockOrder);
    });

    it("should return null if no order found", async () => {
      prismaMock.order.findFirst.mockResolvedValue(null);

      const order = await ordersService.getByUnique({
        field: "orderId",
        value: "non-existent-id",
      });

      expect(order).toBeNull();
    });
  });

  describe("update", () => {
    it("should successfully update an order", async () => {
      const updatedOrder: OrderSchema = { ...mockOrder, totalPrice: 30.0 };
      prismaMock.order.update.mockResolvedValue(updatedOrder);

      const updateData: UpdateOrderType = { totalPrice: 30.0 };
      const order = await ordersService.update("uuid-1", updateData);

      expect(order).toEqual(updatedOrder);
    });

    it("should handle error when update fails", async () => {
      prismaMock.order.update.mockRejectedValue(new Error("Update failed"));

      const updateData: UpdateOrderType = { totalPrice: 30.0 };
      await expect(ordersService.update("uuid-1", updateData)).rejects.toThrow(
        "Update failed",
      );
    });
  });

  describe("delete", () => {
    it("should successfully delete an order", async () => {
      prismaMock.order.delete.mockResolvedValue({});

      const result = await ordersService.delete("uuid-1");

      expect(result).toBe(true);
    });

    it("should handle error when deletion fails", async () => {
      prismaMock.order.delete.mockRejectedValue(new Error("Deletion failed"));

      await expect(ordersService.delete("uuid-1")).rejects.toThrow(
        "Deletion failed",
      );
    });
  });
});
