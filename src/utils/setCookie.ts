import { Response } from "express";
import env from "../config/env.config";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}
const isProduction = env.NODE_ENV === "PRODUCTION";

export const setCookie = (res: Response, loginInfo: AuthTokens) => {
  if (loginInfo.accessToken) {
    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (loginInfo.refreshToken) {
    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
