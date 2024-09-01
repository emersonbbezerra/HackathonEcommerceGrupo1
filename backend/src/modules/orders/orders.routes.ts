import { Request, Response, Router } from "express";
import { OrderController } from "./orders.controller";

const route = Router();
const orderController = new OrderController();

route.get("/orders", async (_: Request, res: Response) =>
  res.send(await orderController.findAll()),
);

route.post("/orders", async (req: Request, res: Response) =>
  res.send(await orderController.create(req.body)),
);

route.get("/orders/:id", async (req: Request, res: Response) =>
  res.send(await orderController.findOne({ id: req.params.id })),
);

route.patch("/orders/:id", async (req: Request, res: Response) =>
  res.send(await orderController.update(req.params.id, req.body)),
);

route.delete("/orders/:id", async (req: Request, res: Response) =>
  res.send(await orderController.delete(req.params.id)),
);

export { route as OrderRoute };
