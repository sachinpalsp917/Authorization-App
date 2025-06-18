import catchError from "../utils/catchError";
import { createAccount, loginUser } from "../services/auth.services";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { CREATED, OK } from "../constants/http";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import { verifyToken } from "../utils/jwt";
import { Session } from "../models/session.models";

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

export const logoutHandler = catchError(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const payload = verifyToken(accessToken)?.payload;

  if (payload) {
    await Session.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res).status(OK).json({
    message: "Logout successful",
  });
});
