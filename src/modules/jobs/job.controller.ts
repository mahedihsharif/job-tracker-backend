import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JobService } from "./job.service";

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
      limit = "10",
      search,
      status,
      apply_start_date,
      apply_end_date,
      job_last_apply_start_date,
      job_last_apply_end_date,
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      apply_start_date?: string;
      apply_end_date?: string;
      job_last_apply_start_date?: string;
      job_last_apply_end_date?: string;
    };
    const { jobs, total } = await JobService.getAllJobs(
      {
        page: parseInt(String(page)),
        limit: parseInt(String(limit)),
        search: search as string | undefined,
        status: status as string | undefined,
        apply_start_date: apply_start_date
          ? new Date(apply_start_date)
          : undefined,
        apply_end_date: apply_end_date ? new Date(apply_end_date) : undefined,
        job_last_apply_start_date: job_last_apply_start_date
          ? new Date(job_last_apply_start_date)
          : undefined,
        job_last_apply_end_date: job_last_apply_end_date
          ? new Date(job_last_apply_end_date)
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
