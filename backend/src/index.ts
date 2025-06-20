import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import { OK } from "./constants/http";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/healthCheck", (_, res) => {
  res.status(OK).json({ message: "healthy" });
});

app.use("/auth", authRoutes);

//protected routes
app.use("/user", authenticate, userRoutes);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`server is running in port ${PORT} in ${NODE_ENV} enviourment`);
  await connectToDatabase();
});
