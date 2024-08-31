import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { Prisma } from "@/config/database/prisma";
import { CreateProductType } from "./dtos/product.dto";
import { ProductSchema } from "./entities/product";

export interface IProductsService {
  findAll(): Promise<ProductSchema[]>;
  create(data: CreateProductType): Promise<ServerError>;
  getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<ProductSchema | null>;
}

class ProductsService implements IProductsService {
  prisma: Prisma | typeof prismaMock;
  constructor(prisma?: typeof prismaMock) {
    this.prisma = prisma || new Prisma();
  }

  async findAll(): Promise<ProductSchema[]> {
    const result = await this.prisma.product.findMany({ take: 10 });
    return result;
  }

  async create(data: CreateProductType): Promise<ServerError> {
    const [nameExist, categoryExist] = await Promise.all([
      this.getByUnique({ field: "name", value: data.name }),
      this.getByUnique({ field: "category", value: data.category }),
    ]);

    if (nameExist && categoryExist) throw new Error("Product already exist.");

    const { name, description, price, category } = data;

    const result = await this.prisma.product.create({
      data: { name, description, price, category },
    });

    if (!result) return new ServerError();

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

    if (!product) throw new Error("Product not found.");

    return product;
  }
}

export { ProductsService };
