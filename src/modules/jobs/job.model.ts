import { model, Schema } from "mongoose";
import { IJob } from "./job.types";

const jobSchema = new Schema<IJob>(
  {
    job_title: { type: String, required: true, trim: true },
    company_name: { type: String, required: true, trim: true },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String,default:"BDT" },
    },
    job_details: { type: String, required: true, trim: true },
    apply_date: { type: Date, required: true },
    last_date: { type: Date, required: true },
    apply_email: { type: String, required: true, trim: true },
    required_skills: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["pending", "applied", "shortlisted"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false },
);

export const Job = model<IJob>("Job", jobSchema);
