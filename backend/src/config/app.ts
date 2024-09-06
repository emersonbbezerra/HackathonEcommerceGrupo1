import cors from "cors";
import express, { Application, json, urlencoded } from "express";

import { routeNotFound } from "@/middleware";
import { routes } from "@/routes";

class App {
  private readonly app: Application;
  constructor() {
    this.app = express();
    this.config();
    this.router();
  }

  // Configs
  private config() {
    this.app.use(json());
    this.app.use(cors({ origin: [/^(.*)/] }));
    this.app.use(urlencoded({ extended: true }));
  }

  // Routes
  private router() {
    this.app.use(routes);

    // route not found
    this.app.use(routeNotFound);
  }

  // Init server
  listen(HOST: string, PORT: number) {
    this.app.listen(PORT, HOST, () =>
      console.log(`Server is running at http://${HOST}:${PORT}`),
    );
  }
}

export { App };
