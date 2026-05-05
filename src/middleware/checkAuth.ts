import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config";
import AppError from "../errorHelper/AppError";
import { User } from "../modules/users/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // ─── 1. Extract token from cookie or Authorization header ─────
      let token: string | undefined;

      if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      } else if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        throw new AppError(httpStatus.FORBIDDEN, "No Token Found!");
      }

      const verifiedToken = verifyToken(
        token,
        env.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      if (!verifiedToken || !verifiedToken.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Token or user!");
      }

      const user = await User.findById(verifiedToken.userId).select(
        "_id name email",
      );

      if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
