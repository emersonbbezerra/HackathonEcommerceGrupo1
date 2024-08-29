import { routeNotFound } from "@/middleware";
import { Router } from "express";

const routes = Router();

routes.use(routeNotFound);

export { routes };
