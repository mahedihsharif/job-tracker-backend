import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config";
import AppError from "../errorHelper/AppError";
import { User } from "../modules/users/user.model";
import { IUser } from "../modules/users/user.types";
import { generateToken, verifyToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
  const { _id, email } = user;

  const JwtPayload = {
    userId: _id,
    email: email,
  };

  const accessToken = generateToken(
    JwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );

  const refreshToken = generateToken(
    JwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    env.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  const user = await User.findOne({ email: verifiedRefreshToken.email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
  return accessToken;
};
