import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import {
  CreateOrderDTO,
  CreateOrderType,
  UpdateOrderDTO,
  UpdateOrderType,
} from "./dtos/order.dto";
import { OrdersService } from "./orders.service";

export interface IOrderController {
  create(
    body: CreateOrderType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  findAll(): Promise<ServerResponse<any> | ZodValidateError>;
  findOne(params: {
    id: string;
  }): Promise<ServerResponse<any> | ZodValidateError>;
  update(
    id: string,
    body: UpdateOrderType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  delete(id: string): Promise<ServerResponse<any> | ZodValidateError>;
}

class OrderController implements IOrderController {
  private readonly ordersService: OrdersService;

  constructor(ordersService?: OrdersService) {
    this.ordersService = ordersService || new OrdersService();
  }

  async create(
    body: CreateOrderType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const validatedFields = CreateOrderDTO.parse(body);
      const result = await this.ordersService.create(validatedFields);
      return new ServerResponse(201, "Successfully created order", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, `Error creating order: ${error.message}`);
    }
  }

  async findAll(): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const orders = await this.ordersService.findAll();
      return new ServerResponse(200, "Successfully found all orders", orders);
    } catch (error: any) {
      return new ServerResponse(500, `Error finding orders: ${error.message}`);
    }
  }

  async findOne(params: {
    id: string;
  }): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const order = await this.ordersService.getByUnique({
        field: "orderId",
        value: params.id,
      });
      if (!order) {
        return new ServerResponse(404, "Order not found");
      }
      return new ServerResponse(200, "Successfully found order by id", order);
    } catch (error: any) {
      return new ServerResponse(500, `Error finding order: ${error.message}`);
    }
  }

  async update(
    id: string,
    body: UpdateOrderType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const validatedFields = UpdateOrderDTO.parse(body);
      const result = await this.ordersService.update(id, validatedFields);
      if (!result) {
        return new ServerResponse(404, "Order not found");
      }
      return new ServerResponse(200, "Successfully updated order", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, `Error updating order: ${error.message}`);
    }
  }

  async delete(id: string): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const success = await this.ordersService.delete(id);
      if (!success) {
        return new ServerResponse(404, "Order not found");
      }
      return new ServerResponse(200, "Successfully deleted order");
    } catch (error: any) {
      return new ServerResponse(500, `Error deleting order: ${error.message}`);
    }
  }
}

export { OrderController };
