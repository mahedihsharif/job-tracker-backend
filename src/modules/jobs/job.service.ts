import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { User } from "../users/user.model";
import { Job } from "./job.model";
import { IJob } from "./job.types";

const create = async (payload: IJob, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User doesn't found, please try again with correct user",
    );
  }
  const jobData = {
    ...payload,
    user: user._id,
  };
  const job = await Job.create(jobData);
  return job;
};

const getAllJobs = async (
  filters: {
    page: number;
    limit: number;
    search?: string | undefined;
    status?: string | undefined;
    apply_start_date?: Date | undefined;
    apply_end_date?: Date | undefined;
    job_last_apply_start_date?: Date | undefined;
    job_last_apply_end_date?: Date | undefined;
  },
  userId: string,
) => {
  const {
    page,
    limit,
    search,
    status,
    apply_start_date,
    apply_end_date,
    job_last_apply_start_date,
    job_last_apply_end_date,
  } = filters;

  const query: Record<string, unknown> = { user: userId };
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { job_title: { $regex: search, $options: "i" } },
      { company_name: { $regex: search, $options: "i" } },
    ];
  }
  if (apply_start_date && apply_end_date) {
    query.apply_date = {
      $gte: new Date(apply_start_date),
      $lte: new Date(apply_end_date),
    };
  }
  if (job_last_apply_start_date && job_last_apply_end_date) {
    query.last_date = {
      $gte: new Date(job_last_apply_start_date),
      $lte: new Date(job_last_apply_end_date),
    };
  }

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Job.countDocuments(query),
  ]);
  return { jobs, total };
};

const updateJob = async (
  payload: Partial<IJob>,
  userId: string,
  jobId: string,
) => {
  const updatedNewJob = await Job.findOneAndUpdate(
    { _id: jobId, user: userId },
    payload,
    { new: true },
  );

  if (!updatedNewJob) {
    throw new AppError(httpStatus.NOT_FOUND, "Job doesn't found!");
  }

  return updatedNewJob;
};

const deleteJob = async (userId: string, jobId: string) => {
  const deletedJob = await Job.findOneAndDelete({ _id: jobId, user: userId });

  if (!deletedJob) {
    throw new AppError(httpStatus.NOT_FOUND, "Job doesn't found!");
  }

  return { message: "Job successfully Deleted" };
};

export const JobService = { create, getAllJobs, updateJob, deleteJob };
