import { AuthRoutes } from "@/modules/auth/auth.routes";
import { OrderRoute } from "@/modules/orders/orders.routes";
import { ProductRoute } from "@/modules/products/products.routes";
import { UserRoute } from "@/modules/users/users.routes";
import { Router } from "express";

const routes = Router();

routes.use("/api/users/", UserRoute);
routes.use("/api/auth", AuthRoutes);
routes.use("/api", ProductRoute);
routes.use("/api", OrderRoute);

export { routes };
