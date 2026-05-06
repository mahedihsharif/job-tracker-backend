import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JobService } from "./job.service";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    console.log(req.body);
    const result = await JobService.create(req.body, String(decodedToken?._id));

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Job Created Successfully!",
      data: result,
    });
  },
);

export const JobController = { create };
