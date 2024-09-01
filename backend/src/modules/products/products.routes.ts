import { Request, Response, Router } from "express";
import { ProductController } from "./products.controller";

const route = Router();
const productController = new ProductController();

route.get("/products", async (_: Request, res: Response) =>
  res.send(await productController.findAll()),
);

route.post("/products", async (req: Request, res: Response) =>
  res.send(await productController.create(req.body)),
);

route.get("/products/:id", async (req: Request, res: Response) =>
  res.send(await productController.findOne({ id: req.params.id })),
);

route.patch("/products/:id", async (req: Request, res: Response) =>
  res.send(await productController.update(req.params.id, req.body)),
);

route.delete("/products/:id", async (req: Request, res: Response) =>
  res.send(await productController.delete(req.params.id)),
);

export { route as ProductRoute };
