import { Product } from "./entities/product";

interface IProductsRepository {
  create(): Promise<Product>;
  findAll(): Promise<Product[]>;
  findOne(): Promise<Product>;
  update(): Promise<Product>;
  delete(): Promise<Product>;
}

class ProductsRepository implements IProductsRepository {
  constructor() {}
  create(): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  findOne(): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  update(): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  delete(): Promise<Product> {
    throw new Error("Method not implemented.");
  }
}

export { ProductsRepository };
