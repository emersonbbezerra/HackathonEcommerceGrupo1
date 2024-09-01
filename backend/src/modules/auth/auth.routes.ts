import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const route = Router();
const authController = new AuthController();

route.post("/login", async (req: Request, res: Response) =>
  res.send(await authController.login(req.body)),
);
route.post("/logout", async (req: AuthenticatedRequest, res: Response) =>
  res.send(await authController.logout(req.user.userId)),
);

export { route as AuthRoutes };
