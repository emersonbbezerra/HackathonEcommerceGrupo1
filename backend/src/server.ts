import { App } from "@/config/app";

const app = new App();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 4000;

app.listen(HOST, PORT);
