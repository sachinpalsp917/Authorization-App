import { Router } from "express";
import { getUserHandler } from "../controllers/user.controllers";

const userRoutes = Router();

//prefix: /user
userRoutes.get("/", getUserHandler);

export default userRoutes;
