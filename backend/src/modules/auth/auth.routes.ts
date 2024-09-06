import {
  AuthenticatedRequest,
  authMiddleware,
} from "@/middleware/auth.middleware";
import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";

const route = Router();
const authController = new AuthController();

route.post("/login", async (req: Request, res: Response) =>
  res.send(await authController.login(req.body)),
);
route.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) =>
    res.send(await authController.show(req.user.userId)),
);
route.post(
  "/logout",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) =>
    res.send(await authController.logout(req.user.userId)),
);

export { route as AuthRoutes };
