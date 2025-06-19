import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUEST,
  UNAUTHORIZED,
} from "../constants/http";
import verficationCode from "../constants/verifcationCodeTypes";
import { Session } from "../models/session.models";
import { User } from "../models/user.models";
import { VerificationCode } from "../models/verificationCode.models";
import appAssert from "../utils/appAssert";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  thirtyDaysFromNow,
  thirtyMinutesFromNow,
} from "../utils/date";
import jwt from "jsonwebtoken";
import {
  refreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { now } from "mongoose";
import { sendMail } from "../utils/sendMail";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import { hashValue } from "../utils/bcrypt";

type createAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: createAccountParams) => {
  /*
        1. verify user doen't exist
        2. create user
        3. create verfication token
        4. send verification email -> done later
        5. create session
        6. sign access & refresh token
        7. return user, refresh & access token
    */

  const existingUser = await User.findOne({ email: data.email });

  //   if (existingUser) {
  //     throw new Error("User already exists");
  //   }
  appAssert(!existingUser, CONFLICT, "Email already in use");

  const newUser = await User.create({
    email: data.email,
    password: data.password,
  });

  const verificationCode = await VerificationCode.create({
    userId: newUser._id,
    type: verficationCode.EMAIL_VERIFICATION,
    expiresAt: thirtyMinutesFromNow(),
  });

  // send verification email - done later
  const url = `${APP_ORIGIN}/auth/verify/email/${verificationCode._id}`;
  const { error } = await sendMail({
    to: newUser.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.log("Error sending email: ", error);
  }

  const session = await Session.create({
    userId: newUser._id,
    userAgent: data.userAgent,
  });

  const refreshToken = jwt.sign({ session: session._id }, JWT_REFRESH_SECRET, {
    audience: ["user"],
    expiresIn: "30d",
  });
  const accessToken = jwt.sign(
    { userId: newUser._id, session: session._id },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  return { user: newUser.omitPassword(), accessToken, refreshToken };
};

type loginParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async ({
  email,
  password,
  userAgent,
}: loginParams) => {
  /*
  1. get the user by email
  2. validate password from request
  3. create a session
  4. sign access & refresh token
  5. return user & tokens
  */

  const user = await User.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isValidUser = await user.comparePassword(password);
  appAssert(isValidUser, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;
  const session = await Session.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({ ...sessionInfo, userId });

  jwt.sign({ userId: user._id, ...sessionInfo }, JWT_SECRET, {
    audience: ["user"],
    expiresIn: "15m",
  });

  return { user: user.omitPassword(), accessToken, refreshToken };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { ...payload } = verifyToken<refreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await Session.findById(payload.payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  //refresh the session if it expires in next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    sessionId: session._id,
    userId: session.userId,
  });

  return { accessToken, newRefreshToken };
};

export const verifyEmail = async (code: string) => {
  /*
    1. get the verification code
    2. update user to verify true
    3. delete verification code
    4. return user
  */

  const validCode = await VerificationCode.findOne({
    _id: code,
    type: verficationCode.EMAIL_VERIFICATION,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await User.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await validCode.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  /*
    1. get the user by email 
    2. check email rate limit
    3. create verification code
    4. send verification email
    5. return success
  */

  const user = await User.findOne({ email });
  appAssert(user, NOT_FOUND, "User not found");

  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCode.countDocuments({
    userId: user._id,
    type: verficationCode.RESET_PASSWORD,
    createdAt: { $gt: fiveMinAgo },
  });
  appAssert(
    count <= 1,
    TOO_MANY_REQUEST,
    "Too many requests, please try again later"
  );

  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCode.create({
    userId: user._id,
    type: verficationCode.RESET_PASSWORD,
    expiresAt,
  });

  const url = `${APP_ORIGIN}/auth/password/reset?code=${verificationCode._id}?exp=${expiresAt.getTime()}`;
  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  return {
    url,
    emailId: data.id,
  };
};

type resetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({
  password,
  verificationCode,
}: resetPasswordParams) => {
  /*
    1. get the verification code
    2. update the users password
    3. delete the verification code
    4. delete all sessions
  */

  const validCode = await VerificationCode.findOne({
    _id: verificationCode,
    type: verficationCode.RESET_PASSWORD,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await User.findByIdAndUpdate(
    validCode.userId,
    {
      password: await hashValue(password, 10),
    },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

  await validCode.deleteOne();

  await Session.deleteMany({
    userId: updatedUser._id,
  });

  return { user: updatedUser.omitPassword() };
};
