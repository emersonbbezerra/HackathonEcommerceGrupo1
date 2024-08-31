import { Request, Response, Router } from "express";
import { UserController } from "./users.controller";

const route = Router();
const userController = new UserController();

route.get("/users", async (_: Request, res: Response) =>
  res.send(await userController.findAll()),
);
route.post("/users", async (req: Request, res: Response) =>
  res.send(await userController.create(req.body)),
);
route.get("/users/:id", async (req: Request, res: Response) =>
  res.send(await userController.findOne(req.params)),
);
route.put("/users/:id", async (req: Request, res: Response) =>
  res.send(await userController.update({ id: req.params.id, body: req.body })),
);
route.delete("/users/:id", async (req: Request, res: Response) =>
  res.send(await userController.delete(req.params.id)),
);

export { route as UserRoute };
