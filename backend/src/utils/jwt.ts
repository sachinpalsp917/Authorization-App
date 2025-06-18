import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { sessionDocument } from "../models/session.models";
import { UserDocument } from "../models/user.models";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

type accessTokenPayload = {
  sessionId: sessionDocument["_id"];
};

type refreshTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: sessionDocument["_id"];
};

type signOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: signOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: signOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: accessTokenPayload | refreshTokenPayload,
  options?: signOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

type verifyOptionsAndSecret = VerifyOptions & {
  secret: string;
};

export const verifyToken = <TPayload extends object = accessTokenPayload>(
  token: string,
  options?: verifyOptionsAndSecret
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      audience: ["user"],
      ...verifyOpts,
    }) as TPayload;

    return { payload };
  } catch (error: any) {
    console.log(error.message);
  }
};
