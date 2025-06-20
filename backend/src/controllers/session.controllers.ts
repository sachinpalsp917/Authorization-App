import { OK } from "../constants/http";
import { Session } from "../models/session.models";
import catchError from "../utils/catchError";

export const getSessionHandler = catchError(async (req, res) => {
  const sessions = await Session.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  res.status(OK).json(
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});
