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
route.patch(":id", async (req: Request, res: Response) => {
  res.send(await userController.update({ id: req.params.id, body: req.body }));
});
route.delete(":id", async (req: Request, res: Response) =>
  res.send(await userController.delete(req.params.id)),
);

export { route as UserRoute };
