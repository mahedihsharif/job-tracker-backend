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

export const JobService = { create };
