import httpStatus from "http-status-codes";
import { TErrorSource, TGenericErrorResponse } from "../interface/error.types";

export const handleValidationError = (err: any): TGenericErrorResponse => {
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
    message: "Validation Error",
    errorSources,
  };
};
