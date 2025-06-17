import catchError from "../utils/catchError";
import { createAccount, loginUser } from "../services/auth.services";
import { setAuthCookies } from "../utils/cookies";
import { CREATED, OK } from "../constants/http";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";

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

export const loginHandler = catchError(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { refreshToken, accessToken } = await loginUser(request);

  setAuthCookies({ refreshToken, accessToken, res })
    .status(OK)
    .json({ message: "Logged in" });
});
