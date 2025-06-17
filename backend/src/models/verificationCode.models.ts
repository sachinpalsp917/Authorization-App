import mongoose from "mongoose";
import verficationCode from "../constants/verifcationCodeTypes";

export interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: verficationCode;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export const Verification = mongoose.model<VerificationCodeDocument>(
  "Verification",
  verificationCodeSchema,
  "verification_codes"
);
