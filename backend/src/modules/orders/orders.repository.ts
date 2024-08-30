import { Order } from "./entities/order";

interface IOrdersRepository {
  create(): Promise<Order>;
  findAll(): Promise<Order[]>;
  findOne(): Promise<Order>;
  update(): Promise<Order>;
  delete(): Promise<Order>;
}

class OrdersRepository implements IOrdersRepository {
  constructor() {}
  create(): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
  findOne(): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  update(): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  delete(): Promise<Order> {
    throw new Error("Method not implemented.");
  }
}

export { OrdersRepository };
