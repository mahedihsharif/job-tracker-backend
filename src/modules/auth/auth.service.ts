import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";
import { User } from "../users/user.model";
import { IUser } from "../users/user.types";

const register = async (payload: IUser) => {
  const { name, email, password } = payload;
  const user = await User.findOne({ email });

  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, `${email} is already exist!`);
  }
  const newUser =await User.create({
    name,
    email,
    password,
  });
  const { password:newPassword,...rest}=newUser.toObject()
  return rest;
};

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User doesn't found, please check and try again",
    );
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Password is incorrect, please try again with correct password",
    );
  }

  const userToken = createUserToken(user);

  const { password: pass, ...rest } = user.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

const resetPassword = async (newPassword: string, userId: string) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User doesn't found, please check and try again!",
    );
  }

  if (!user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not available");
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from your current password.",
    );
  }
  //Update password (pre-save hook in user.model.ts will hash it)
  user.password = newPassword;
  await user.save();
  return {
    message:
      "Password reset successfully. Please log in with your new password.",
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User doesn't found, please check and try again!",
    );
  }
  const { password, ...rest } = user.toObject();
  return rest;
};

const refreshToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = { register, login, resetPassword, getMe,refreshToken };
