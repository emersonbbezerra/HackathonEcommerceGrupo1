import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import { CreateProductDTO, CreateProductType } from "./dtos/product.dto";
import { ProductsService } from "./products.service";

export interface IProductController {
  create(
    body: CreateProductType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
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
      if (!validatedFields) throw new Error(validatedFields);

      const result = await this.productsService.create(validatedFields);
      return new ServerResponse(201, "Successfully create product", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(400, error.message);
    }
  }
}

export { ProductController };
