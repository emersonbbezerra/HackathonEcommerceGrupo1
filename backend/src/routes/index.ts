import { UserRoute } from "@/modules/users/users.routes";
import { Router } from "express";

const routes = Router();

routes.use("/api", UserRoute);

export { routes };
