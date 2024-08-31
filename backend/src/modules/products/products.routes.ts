import { Request, Response, Router } from "express";
import { ProductController } from "./products.controller";

const route = Router();
const productController = new ProductController();

route.post("/product", async (req: Request, res: Response) =>
  res.send(await productController.create(req.body)),
);

export { route as UserRoute };
