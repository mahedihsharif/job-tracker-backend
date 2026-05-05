import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error.types";

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSource[] = [];
  const errors = Object.values(err);

  errors.forEach((errorObject: any) => {
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    });
  });
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Invalid mongodb ObjectId, please provide a valid mongodb Id",
    errorSources,
  };
};

export default handleCastError;
