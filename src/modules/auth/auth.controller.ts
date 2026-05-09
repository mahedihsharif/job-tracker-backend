import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelper/AppError";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.register(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully!",
      data: result,
    });
  },
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.login(req.body);
    setCookie(res, result);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Use login successfully",
      data: result,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;
    const decodedToken = req.user;
    const result = await AuthService.resetPassword(
      newPassword,
      String(decodedToken?._id),
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: "",
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const result = await AuthService.getMe(String(decodedToken?._id));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  },
);

const logout = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken",{
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully",
      data: "",
    });
  },
);


const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received!");
    }

    const tokenInfo = await AuthService.refreshToken(
      refreshToken as string
    );
    setCookie(res, tokenInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Retrieved Successfully!",
      data: tokenInfo,
    });
  }
);

export const AuthController = {
  register,
  login,
  resetPassword,
  getMe,
  logout,
  refreshToken
};
