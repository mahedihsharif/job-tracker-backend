import { Types } from "mongoose";
export type TStatus = "pending" | "applied" | "shortlisted";

export interface IJob {
  job_title: string;
  company_name: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  job_details: string;
  apply_date?: Date;
  last_date?: Date;
  apply_email?: string;
  required_skills?: string[];
  status: TStatus;
  user: Types.ObjectId;
}

export interface IStatusCounts {
  pending: number;
  applied: number;
  shortlisted: number;
  [key: string]: number;
}

export interface IGetAllJobsResult {
  jobs: IJob[];
  total: number;
  counts: IStatusCounts;
}

export interface IStatusCountItem {
  _id: string;
  count: number;
}
