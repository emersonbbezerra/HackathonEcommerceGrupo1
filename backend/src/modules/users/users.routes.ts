import { Router } from "express";
import { UserController } from "./users.controller";

const route = Router();
const userController = new UserController();

route.post("/user", (req) => userController.create(req.body));

export { route as UserRoute };
