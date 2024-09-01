import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { Prisma } from "@/config/database/prisma";
import { CreateProductType, UpdateProductType } from "./dtos/product.dto";
import { ProductSchema } from "./entities/product";

export interface IProductsService {
  findAll(): Promise<ProductSchema[]>;
  create(data: CreateProductType): Promise<ProductSchema | ServerError>;
  getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<ProductSchema | null>;
  update(id: string, data: UpdateProductType): Promise<ProductSchema | null>;
  delete(id: string): Promise<boolean>;
}

class ProductsService implements IProductsService {
  prisma: Prisma | typeof prismaMock;

  constructor(prisma?: typeof prismaMock) {
    this.prisma = prisma || new Prisma();
  }

  async findAll(): Promise<ProductSchema[]> {
    return this.prisma.product.findMany({ take: 10 });
  }

  async create(data: CreateProductType): Promise<ProductSchema | ServerError> {
    try {
      // Check if a product with the same name or category already exists
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          OR: [{ name: data.name }, { category: data.category }],
        },
      });

      if (existingProduct) {
        throw new Error("Product already exists.");
      }

      // Create new product
      const result = await this.prisma.product.create({
        data: data,
      });

      return result;
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
  }): Promise<ProductSchema | null> {
    return this.prisma.product.findFirst({
      where: { [field]: value },
    });
  }

  async update(
    id: string,
    data: UpdateProductType,
  ): Promise<ProductSchema | null> {
    try {
      // Find and update the product
      const result = await this.prisma.product.update({
        where: { id },
        data,
      });

      return result;
    } catch (error) {
      // Log error if necessary
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Log error if necessary
      return false;
    }
  }
}

export { ProductsService };
