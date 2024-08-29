import { Request, Response } from "express";

export function routeNotFound(_req: Request, res: Response) {
  res.status(400).json({ message: "Url not found!" });
}
