import { Response } from "express";
import env from "../config/env.config";
import { CookieOptions } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}
const isProduction = env.NODE_ENV === "PRODUCTION";
 

export const setCookie = (res: Response, loginInfo: AuthTokens) => {
   const cookieOptions:CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite:
      isProduction ? "none" : "lax",
  };
  if (loginInfo.accessToken) {
    res.cookie("accessToken", loginInfo.accessToken, cookieOptions);
  }

  if (loginInfo.refreshToken) {
    res.cookie("refreshToken", loginInfo.refreshToken, cookieOptions);
  }
};
