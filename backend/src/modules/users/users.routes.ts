import { Request, Response, Router } from "express";
import { UserController } from "./users.controller";

const route = Router();
const userController = new UserController();

route.post("/user", async (req: Request, res: Response) =>
  res.send(await userController.create(req.body)),
);

export { route as UserRoute };
