import { z } from "zod";
import catchError from "../utils/catchError";
import { createAccount } from "../services/auth.services";
import { setAuthCookies } from "../utils/cookies";
import { CREATED } from "../constants/http";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(12),
    confirmPassword: z.string().min(6).max(12),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirm-Password"],
  });

export const registerHandler = catchError(async (req, res) => {
  //validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //call service
  const { user, refreshToken, accessToken } = await createAccount(request);

  //return response
  setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user);
});
