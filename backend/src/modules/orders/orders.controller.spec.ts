import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { ZodError } from "zod";
import {
  CreateOrderDTO,
  CreateOrderType,
  UpdateOrderDTO,
  UpdateOrderType,
} from "./dtos/order.dto";
import { OrderSchema } from "./entities/order";
import { IOrderController, OrderController } from "./orders.controller";
import { OrdersService } from "./orders.service";

jest.mock("./orders.service");

let orderController: IOrderController;
let ordersServiceMock: jest.Mocked<OrdersService>;

describe("OrderController", () => {
  beforeEach(() => {
    ordersServiceMock = new OrdersService(
      prismaMock,
    ) as jest.Mocked<OrdersService>;
    orderController = new OrderController(ordersServiceMock);
  });

  describe("findAll orders", () => {
    it("Should successfully find all orders", async () => {
      const ordersData: OrderSchema[] = [
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
      ordersServiceMock.findAll.mockResolvedValueOnce(ordersData);

      const resp = await orderController.findAll();

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully found all orders", ordersData),
      );
    });

    it("Should return ServerResponse with error when findAll fails", async () => {
      const errorMessage = "Error finding orders: Failed to find orders";
      ordersServiceMock.findAll.mockRejectedValueOnce(
        new Error("Failed to find orders"),
      );

      const resp = await orderController.findAll();

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Create order", () => {
    const httpRequest: CreateOrderType = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      customerAddress: "123 Elm Street",
      items: [
        {
          product: {
            id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
            name: "Sample Product",
            description: "A sample product",
            image: null,
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

    it("Should return ZodValidateError", async () => {
      const zodError = new ZodError([]);
      jest.spyOn(CreateOrderDTO, "parse").mockImplementationOnce(() => {
        throw zodError;
      });

      const resp = await orderController.create(httpRequest);

      expect(resp).toBeInstanceOf(ZodValidateError);
      expect((resp as ZodValidateError).errors).toEqual(zodError.errors);
    });

    it("Should successfully create an order", async () => {
      const orderData: OrderSchema = {
        orderId: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "123 Elm Street",
        items: [
          {
            product: {
              id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
              name: "Sample Product",
              description: "A sample product",
              image: null,
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
      ordersServiceMock.create.mockResolvedValueOnce(orderData);

      const resp = await orderController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(201, "Successfully created order", orderData),
      );
    });

    it("Should return ServerResponse when order creation fails", async () => {
      const errorMessage = "Error creating order: Creation failed";
      ordersServiceMock.create.mockRejectedValueOnce(
        new Error("Creation failed"),
      );

      const resp = await orderController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("findOne order", () => {
    it("Should successfully find one order", async () => {
      const orderData: OrderSchema = {
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
      ordersServiceMock.getByUnique.mockResolvedValueOnce(orderData);

      const resp = await orderController.findOne({ id: orderData.orderId });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully found order by id", orderData),
      );
    });

    it("Should return ServerResponse with error when findOne fails", async () => {
      const errorMessage = "Error finding order: Failed to find order";
      ordersServiceMock.getByUnique.mockRejectedValueOnce(
        new Error("Failed to find order"),
      );

      const resp = await orderController.findOne({ id: "non-existing-id" });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Update order", () => {
    const id = "order-id";
    const httpRequest: UpdateOrderType = {
      customerName: "Jane Doe",
      customerPhone: "0987654321",
      customerAddress: "456 Oak Avenue",
      items: [
        {
          product: {
            id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
            name: "Sample Product",
            description: "A sample product",
            image: null,
            price: 119.98,
            category: "Sample Category",
            created_at: new Date(),
            updated_at: new Date(),
          },
          quantity: 2,
          price: 119.98,
        },
      ],
      totalPrice: 119.98,
      orderStatus: "preparing",
      orderDate: new Date("2024-08-31T19:30:57.510Z"),
      paymentMethod: "paypal",
    };

    it("Should return ZodValidateError", async () => {
      const zodError = new ZodError([]);
      jest.spyOn(UpdateOrderDTO, "parse").mockImplementationOnce(() => {
        throw zodError;
      });

      const resp = await orderController.update(id, httpRequest);

      expect(resp).toBeInstanceOf(ZodValidateError);
      expect((resp as ZodValidateError).errors).toEqual(zodError.errors);
    });

    it("Should successfully update an order", async () => {
      const updatedOrder: OrderSchema = {
        orderId: id,
        customerName: "Jane Doe",
        customerPhone: "0987654321",
        customerAddress: "456 Oak Avenue",
        items: [
          {
            product: {
              id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
              name: "Sample Product",
              description: "A sample product",
              image: null,
              price: 119.98,
              category: "Sample Category",
              created_at: new Date(),
              updated_at: new Date(),
            },
            quantity: 2,
            price: 119.98,
          },
        ],
        totalPrice: 119.98,
        orderStatus: "preparing",
        orderDate: new Date("2024-08-31T19:30:57.510Z"),
        paymentMethod: "paypal",
      };
      ordersServiceMock.update.mockResolvedValueOnce(updatedOrder);

      const resp = await orderController.update(id, httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully updated order", updatedOrder),
      );
    });

    it("Should return ServerResponse with error when update fails", async () => {
      const errorMessage = "Error updating order: Failed to update order";
      ordersServiceMock.update.mockRejectedValueOnce(
        new Error("Failed to update order"),
      );

      const resp = await orderController.update(id, httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Delete order", () => {
    const id = "order-id";

    it("Should successfully delete an order", async () => {
      // Ajustar a mockagem para retornar um valor booleano
      ordersServiceMock.delete.mockResolvedValueOnce(true);

      const resp = await orderController.delete(id);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully deleted order"),
      );
    });

    it("Should return ServerResponse with error when delete fails", async () => {
      const errorMessage = "Error deleting order: Failed to delete order";
      ordersServiceMock.delete.mockRejectedValueOnce(
        new Error("Failed to delete order"),
      );

      const resp = await orderController.delete("non-existing-id");

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });
});
