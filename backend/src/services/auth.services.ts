import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import verficationCode from "../constants/verifcationCodeTypes";
import { Session } from "../models/session.models";
import { User } from "../models/user.models";
import { VerificationCode } from "../models/verificationCode.models";
import { thirtyMinutesFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

export type createAccountParams = {
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

  if (existingUser) {
    throw new Error("User already exists");
  }

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

  return { newUser, accessToken, refreshToken };
};
