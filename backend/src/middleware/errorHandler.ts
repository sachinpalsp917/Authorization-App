import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH: ${req.path}`, err);
  res.status(500).send("Internal server error");
};

export default errorHandler;
