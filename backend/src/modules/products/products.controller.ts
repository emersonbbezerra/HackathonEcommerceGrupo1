import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import {
  CreateProductDTO,
  CreateProductType,
  UpdateProductDTO,
  UpdateProductType,
} from "./dtos/product.dto";
import { ProductsService } from "./products.service";

export interface IProductController {
  create(
    body: CreateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  findAll(): Promise<ServerResponse<any> | ZodValidateError>;
  findOne(params: {
    id: string;
  }): Promise<ServerResponse<any> | ZodValidateError>;
  update(
    id: string,
    body: UpdateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  delete(id: string): Promise<ServerResponse<any> | ZodValidateError>;
}

class ProductController implements IProductController {
  private readonly productsService: ProductsService;

  constructor(productsService?: ProductsService) {
    this.productsService = productsService || new ProductsService();
  }

  async create(
    body: CreateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const validatedFields = CreateProductDTO.parse(body);
      const result = await this.productsService.create(validatedFields);
      return new ServerResponse(201, "Successfully created product", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(
        400,
        `Error creating product: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const products = await this.productsService.findAll();
      return new ServerResponse(
        200,
        "Successfully found all products",
        products,
      );
    } catch (error: any) {
      return new ServerResponse(
        500,
        `Error finding products: ${error.message}`,
      );
    }
  }

  async findOne(params: {
    id: string;
  }): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const product = await this.productsService.getByUnique({
        field: "id",
        value: params.id,
      });

      if (!product) {
        return new ServerResponse(404, "Product not found");
      }

      return new ServerResponse(
        200,
        "Successfully found product by id",
        product,
      );
    } catch (error: any) {
      return new ServerResponse(500, `Error finding product: ${error.message}`);
    }
  }

  async update(
    id: string,
    body: UpdateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const validatedFields = UpdateProductDTO.parse(body);
      const result = await this.productsService.update(id, validatedFields);

      if (!result) {
        return new ServerResponse(404, "Product not found");
      }

      return new ServerResponse(200, "Successfully updated product", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(
        400,
        `Error updating product: ${error.message}`,
      );
    }
  }

  async delete(id: string): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const success = await this.productsService.delete(id);

      if (!success) {
        return new ServerResponse(404, "Product not found");
      }

      return new ServerResponse(200, "Successfully deleted product");
    } catch (error: any) {
      return new ServerResponse(
        500,
        `Error deleting product: ${error.message}`,
      );
    }
  }
}

export { ProductController };
