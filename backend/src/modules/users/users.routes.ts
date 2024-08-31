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

export { route as UserRoute };
