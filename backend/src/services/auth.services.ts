import { User } from "../models/user.models";

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
        4. send verification email
        5. create session
        6. sign access & refresh token
        7. return user, refresh & access token
    */

  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = User.create({ email: data.email, password: data.password });
};
