import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types.ObjectId;
      sessionId: mongoose.Types.ObjectId;
    }
  }
}

// if this does not work go into /node_modules/@types/express-serve-static-core/index.d.ts and paste this userId and sessionId
export {};
