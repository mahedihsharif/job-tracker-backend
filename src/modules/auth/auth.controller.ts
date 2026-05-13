import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";

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
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully",
      data: "",
    });
  },
);

export const AuthController = {
  register,
  login,
  resetPassword,
  getMe,
  logout
};
