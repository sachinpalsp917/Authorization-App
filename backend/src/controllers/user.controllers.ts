import { NOT_FOUND, OK } from "../constants/http";
import { User } from "../models/user.models";
import appAssert from "../utils/appAssert";
import catchError from "../utils/catchError";

export const getUserHandler = catchError(async (req, res) => {
  const user = await User.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  res.status(OK).json(user.omitPassword());
});
