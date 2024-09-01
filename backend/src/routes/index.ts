import { UserRoute } from "@/modules/users/users.routes";
import { ProductRoute } from "@/modules/products/products.routes";
import { OrderRoute } from "@/modules/orders/orders.routes";
import { Router } from "express";

const routes = Router();

routes.use("/api", UserRoute);
routes.use("/api", ProductRoute);
routes.use("/api", OrderRoute);

export { routes };
