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
  update(id: string, data: UpdateProductType): Promise<boolean | ServerError>;
  delete(id: string): Promise<boolean | ServerError>;
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
    const productExist = await this.prisma.product.findFirst({
      where: {
        OR: [{ name: data.name }, { category: data.category }],
      },
    });

    if (productExist) {
      throw new Error("Product already exists.");
    }

    const result = await this.prisma.product.create({
      data: data,
    });
    if (!result) throw new ServerError();

    return result;
  }

  async getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<ProductSchema | null> {
    const product = await this.prisma.product.findFirst({
      where: { [field]: value },
    });

    if (!product) return null;

    return product;
  }

  async update(
    id: string,
    data: UpdateProductType,
  ): Promise<boolean | ServerError> {
    const product = await this.getByUnique({ field: "id", value: id });

    if (!product) {
      throw new ServerError("Product not exist.");
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data,
    });
    if (!updatedProduct) throw new ServerError("Update failed");

    return true;
  }

  async delete(id: string): Promise<boolean | ServerError> {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    if (!product) throw new ServerError("Product not exist.");
    return true;
  }
}

export { ProductsService };
