import {
  AuthenticatedRequest,
  authMiddleware,
} from "@/middleware/auth.middleware";
import { Request, Response, Router } from "express";
import { UserController } from "./users.controller";

const route = Router();
const userController = new UserController();

route.get("", async (_: Request, res: Response) =>
  res.send(await userController.findAll()),
);
route.post("", async (req: Request, res: Response) =>
  res.send(await userController.create(req.body)),
);
route.get(":id", async (req: Request, res: Response) =>
  res.send(await userController.findOne(req.params)),
);
route.patch(
  "",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    res.send(await userController.update({ id: req.user.id, body: req.body }));
  },
);
route.delete(
  "",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) =>
    res.send(await userController.delete(req.user.id)),
);

export { route as UserRoute };
