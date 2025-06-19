import catchError from "../utils/catchError";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.services";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  verificationCodeSchema,
} from "../schemas/auth.schemas";
import { verifyToken } from "../utils/jwt";
import { Session } from "../models/session.models";
import appAssert from "../utils/appAssert";

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
  const accessToken = req.cookies.accessToken as string | undefined;
  const payload = verifyToken(accessToken || "")?.payload;

  if (payload) {
    await Session.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res).status(OK).json({
    message: "Logout successful",
  });
});

export const refreshHandler = catchError(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed",
    });
});

export const verifyEmailHandler = catchError(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  const { user } = await verifyEmail(verificationCode);

  res.status(OK).json({
    message: "User verified successfully",
    user,
  });
});

export const sendPasswordResetHandler = catchError(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  res.status(OK).json({
    message: "Password reset email sent!!! ",
  });
});
