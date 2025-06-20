import { Router } from "express";
import { getSessionHandler } from "../controllers/session.controllers";

const sessionRoutes = Router();

//prefix: /sessions
sessionRoutes.get("/", getSessionHandler);

export default sessionRoutes;
