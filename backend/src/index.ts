import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";

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

app.use("/", (req, res) => {
  res.send({ message: "healthy" });
});

app.listen(PORT, async () => {
  console.log(`server is running in port ${PORT} in ${NODE_ENV} enviourment`);
  await connectToDatabase();
});
