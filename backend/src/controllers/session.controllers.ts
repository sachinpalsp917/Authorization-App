import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import { Session } from "../models/session.models";
import catchError from "../utils/catchError";
import appAssert from "../utils/appAssert";

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

export const deleteSessionHandler = catchError(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await Session.findByIdAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");

  res.status(OK).json({
    message: "Session removed",
  });
});
