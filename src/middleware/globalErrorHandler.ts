import { NextFunction, Request, Response } from "express";
import env from "../config/env.config";
import AppError from "../errorHelper/AppError";
import handleCastError from "../helpers/handleCastError";
import handleDuplicateError from "../helpers/handleDuplicateError";
import { handleValidationError } from "../helpers/handleValidationError";
import handleZodError from "../helpers/handleZodError";
import { TErrorSource } from "../interface/error.types";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let errorSources: TErrorSource[] = [];
  let statusCode = 500;
  let message = "Something went to wrong!";
  let type;

  //mongoose duplicate key error
  if (err.code === 11000) {
    const simpliFiedError = handleDuplicateError(err);
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
  }

  //mongoose CastError or MongoDB ObjectID Error
  else if (err.name === "CastError") {
    const simpliFiedError = handleCastError(err);
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
  }
  //Zod Validation Error
  else if (err.name === "ZodError") {
    const simpliFiedError = handleZodError(err);
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
    errorSources = simpliFiedError.errorSources as TErrorSource[];
  }

  //mongoose validation Error
  else if (err.name === "ValidationError") {
    const simpliFiedError = handleValidationError(err);
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
  }

  //custom app error
  else if (err instanceof AppError) {
    statusCode = err.statuscode;
    message = err.message;
    type = err.type || null;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    errorSources,
    message,
    type,
    err: env.NODE_ENV === "DEVELOPMENT" ? err : null,
    stack: env.NODE_ENV === "DEVELOPMENT" ? err.stack : null,
  });
};

export default globalErrorHandler;
