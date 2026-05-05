import httpStatus from "http-status-codes";
import { TErrorSource, TGenericErrorResponse } from "../interface/error.types";

const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSource[] = [];
  const errors = err.issues;
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path[errorObject.path.length - 1],
      message: errorObject.message,
    }),
  );
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Zod Error",
    errorSources,
  };
};
export default handleZodError;
