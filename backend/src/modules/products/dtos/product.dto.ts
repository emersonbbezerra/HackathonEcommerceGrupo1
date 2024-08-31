import { z } from "zod";
import { Product } from "../entities/product";

// DTO para criação de produto
const CreateProductDTO = Product.pick({
  name: true,
  description: true,
  image: true,
  price: true,
  category: true,
});

// DTO para atualização parcial de produto
const UpdateProductDTO = Product.partial();

export type CreateProductType = z.infer<typeof CreateProductDTO>;
export type UpdateProductType = z.infer<typeof UpdateProductDTO>;

export { CreateProductDTO, UpdateProductDTO };
