import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import verficationCode from "../constants/verifcationCodeTypes";
import { Session } from "../models/session.models";
import { User } from "../models/user.models";
import { VerificationCode } from "../models/verificationCode.models";
import appAssert from "../utils/appAssert";
import { thirtyMinutesFromNow } from "../utils/date";
import jwt from "jsonwebtoken";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

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
