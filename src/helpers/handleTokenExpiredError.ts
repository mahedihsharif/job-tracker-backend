import httpStatus from "http-status-codes";
import { TGenericErrorResponse } from "../interface/error.types";
const handleTokenExpiredError = (): TGenericErrorResponse => {
  return {
    statusCode: httpStatus.UNAUTHORIZED,
    message: "Token expired, please login again",
    errorSources: [],
  };
};

export default handleTokenExpiredError;
