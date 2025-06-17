import { z } from "zod";
import catchError from "../utils/catchError";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(12),
    confirmPassword: z.string().min(6).max(12),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirm-Password"],
  });

export const registerHandler = catchError(async (req, res) => {
  //validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  console.log(request);
  //call service
  //return response
});
