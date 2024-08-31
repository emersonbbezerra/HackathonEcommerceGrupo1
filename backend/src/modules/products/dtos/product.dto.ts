import { z } from "zod";
import { Product } from "../entities/product";

const CreateProductDTO = Product.pick({
  name: true,
  description: true,
  price: true,
  category: true,
});

const UpdateProductDTO = Product.partial();

export type CreateProductType = z.infer<typeof CreateProductDTO>;
export type UpdateProductType = z.infer<typeof UpdateProductDTO>;

export { CreateProductDTO, UpdateProductDTO };
