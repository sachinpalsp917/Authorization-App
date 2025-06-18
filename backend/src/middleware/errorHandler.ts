import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join(". "),
    message: err.message,
  }));
  res.status(BAD_REQUEST).json({
    errors,
  });
};

const handleAppError = (res: Response, err: AppError) => {
  res.status(err.statusCode).json({
    message: err.message,
    errCode: err.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH: ${req.path}`, err);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (err instanceof z.ZodError) {
    return handleZodError(res, err);
  }

  if (err instanceof AppError) {
    return handleAppError(res, err);
  }
  res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};

export default errorHandler;
