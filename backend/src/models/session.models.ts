import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface sessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<sessionDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow,
  },
});

export const Session = mongoose.model<sessionDocument>(
  "session",
  sessionSchema
);
