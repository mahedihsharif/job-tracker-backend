import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelper/AppError";
import { User } from "../users/user.model";
import { Job } from "./job.model";
import { IJob, IStatusCountItem, IStatusCounts } from "./job.types";

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
    apply_date_start?: Date | undefined;
    apply_date_end?: Date | undefined;
    last_date_start?: Date | undefined;
    last_date_end?: Date | undefined;
  },
  userId: string,
) => {
  const {
    page,
    limit,
    search,
    status,
    apply_date_start,
    apply_date_end,
    last_date_start,
    last_date_end,
  } = filters;

  const query: Record<string, unknown> = {
    user: new mongoose.Types.ObjectId(userId),
  };
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { job_title: { $regex: search, $options: "i" } },
      { company_name: { $regex: search, $options: "i" } },
    ];
  }
  if (apply_date_start && apply_date_end) {
    query.apply_date = {
      $gte: new Date(apply_date_start),
      $lte: new Date(apply_date_end),
    };
  }
  if (last_date_start && last_date_end) {
    query.last_date = {
      $gte: new Date(last_date_start),
      $lte: new Date(last_date_end),
    };
  }

  //using aggregation to get jobs, total count and status wise count in single query
  const [result] = await Job.aggregate([
    { $match: query },

    {
      $facet: {
        jobs: [
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],

        total: [{ $count: "count" }],

        statusCounts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const jobs = result.jobs;
  const total = result.total[0]?.count || 0;

  const counts = result.statusCounts.reduce(
    (acc: IStatusCounts, item: IStatusCountItem) => {
      acc[item._id] = item.count;
      return acc;
    },
    {} as IStatusCounts,
  );

  return {
    jobs,
    total,
    counts: {
      pending: counts.pending || 0,
      applied: counts.applied || 0,
      shortlisted: counts.shortlisted || 0,
    },
  };
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
