import httpStatus from "http-status-codes";
import { TGenericErrorResponse } from "../interface/error.types";

const handleJsonWebTokenError = (): TGenericErrorResponse => {
  return {
    statusCode: httpStatus.UNAUTHORIZED,
    message: "Invalid token, please login again",
    errorSources: [],
  };
};

export default handleJsonWebTokenError;
