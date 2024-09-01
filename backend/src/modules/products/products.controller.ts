import { ServerResponse } from "@/common/constants";
import { ServerError } from "@/common/errors/server-error";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import {
  CreateProductDTO,
  CreateProductType,
  UpdateProductDTO,
  UpdateProductType,
} from "./dtos/product.dto";
import { ProductSchema } from "./entities/product";
import { ProductsService } from "./products.service";

export interface IProductController {
  create(
    body: CreateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  findAll(): Promise<ServerResponse<ProductSchema[]> | null>;
  findOne(params): Promise<ServerResponse<ProductSchema | null>>;
  update(
    id: string,
    body: UpdateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  delete(id: string): Promise<ServerResponse<boolean | ServerError>>;
}

class ProductController implements IProductController {
  private readonly productsService: ProductsService;

  constructor(productsService?: ProductsService) {
    this.productsService = productsService || new ProductsService();
  }

  async findAll(): Promise<ServerResponse<ProductSchema[]> | null> {
    try {
      const products = await this.productsService.findAll();
      return new ServerResponse(
        200,
        "Successfully found all products",
        products,
      );
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }

  async create(
    body: CreateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const product = CreateProductDTO.parse(body);
      const result = await this.productsService.create(product);
      return new ServerResponse(201, "Successfully created product", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, error.message);
    }
  }

  async findOne(params): Promise<ServerResponse<ProductSchema | null>> {
    try {
      const result = await this.productsService.getByUnique(params);
      return new ServerResponse(
        200,
        "Successfully found product by id",
        result,
      );
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }

  async update(
    id: string,
    body: UpdateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const data = UpdateProductDTO.parse(body);
      if (!data) throw new Error(data);

      const result = await this.productsService.update(id, data);
      return new ServerResponse(202, "Successfully update product", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, error.message);
    }
  }

  async delete(id: string): Promise<ServerResponse<boolean | ServerError>> {
    try {
      const result = await this.productsService.delete(id);
      return new ServerResponse(200, "Successfully delete product", result);
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }
}

export { ProductController };
