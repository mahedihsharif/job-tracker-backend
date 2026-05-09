import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JobService } from "./job.service";
import { log } from "console";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const result = await JobService.create(req.body, String(decodedToken?._id));
 
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Job Created Successfully!",
      data: result,
    });
  },
);

const getAllJobs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const {
      page = "1",
      limit = "100",
      search,
      status,
      apply_date_start,
      apply_date_end,
      last_date_start,
      last_date_end,
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      apply_date_start?: string;
      apply_date_end?: string;
      last_date_start?: string;
      last_date_end?: string;
    };
    const { jobs, total } = await JobService.getAllJobs(
      {
        page: parseInt(String(page)),
        limit: parseInt(String(limit)),
        search: search as string | undefined,
        status: status as string | undefined,
        apply_date_start: apply_date_start
          ? new Date(apply_date_start)
          : undefined,
        apply_date_end: apply_date_end ? new Date(apply_date_end) : undefined,
        last_date_start: last_date_start
          ? new Date(last_date_start)
          : undefined,
        last_date_end: last_date_end
          ? new Date(last_date_end)
          : undefined,
      },
      String(decodedToken?._id),
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Jobs retrieved successfully!",
      data: { jobs, total },
    });
  },
);

const updateJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const jobId = req.params.id as string;
    const result = await JobService.updateJob(
      req.body,
      String(decodedToken?._id),
      jobId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Job updated successfully",
      data: result,
    });
  },
);

const deleteJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const jobId = req.params.id as string;
    const result = await JobService.deleteJob(String(decodedToken?._id), jobId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: "",
    });
  },
);

export const JobController = { create, getAllJobs, updateJob, deleteJob };
