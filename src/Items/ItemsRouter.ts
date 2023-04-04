import { Router } from "express";

export const ItemsRouter = Router().get("/hi", (req, res) => res.send("Hello"))