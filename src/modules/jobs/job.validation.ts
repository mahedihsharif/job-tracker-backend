import z from "zod";

export const jobValidationSchema = z
  .object({
    job_title: z
      .string()
      .min(3, { message: "Job title must be at least 3 characters" }),

    company_name: z
      .string()
      .min(2, { message: "Company name must be at least 2 characters" }),

    salary: z
      .object({
        min: z
          .number({ message: "Minimum salary must be a number" })
          .nonnegative("Min salary cannot be negative"),

        max: z
          .number({ message: "Maximum salary must be a number" })
          .nonnegative("Max salary cannot be negative"),

        currency: z.string().optional().default("BDT"),
      })
      .refine((data) => data.max >= data.min, {
        message: "Max salary must be greater than or equal to min salary",
        path: ["max"],
      })
      .optional(),

    job_details: z
      .string()
      .min(10, { message: "Job details must be at least 10 characters" }),

    apply_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Apply date must be a valid date",
    }),

    last_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Last date must be a valid date",
    }),

    apply_email: z.email("Invalid email format"),

    required_skills: z
      .array(z.string().min(1, { message: "Skill cannot be empty" }))
      .min(1, { message: "At least one skill is required" }),

    status: z.enum(["pending", "applied", "shortlisted"]),
  })
  .refine((data) => new Date(data.last_date) >= new Date(data.apply_date), {
    message: "Last date cannot be before apply date",
    path: ["last_date"],
  });

export const updateJobValidationSchema = z
  .object({
    job_title: z
      .string()
      .min(3, { message: "Job title must be at least 3 characters" })
      .optional(),

    company_name: z
      .string()
      .min(2, { message: "Company name must be at least 2 characters" })
      .optional(),

    salary: z
      .object({
        min: z
          .number({ message: "Minimum salary must be a number" })
          .nonnegative("Min salary cannot be negative"),

        max: z
          .number({ message: "Maximum salary must be a number" })
          .nonnegative("Max salary cannot be negative"),

        currency: z.string().optional().default("BDT"),
      })
      .refine((data) => data.max >= data.min, {
        message: "Max salary must be greater than or equal to min salary",
        path: ["max"],
      })
      .optional(),

    job_details: z
      .string()
      .min(10, { message: "Job details must be at least 10 characters" })
      .optional(),

    apply_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Apply date must be a valid date",
      })
      .optional(),

    last_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Last date must be a valid date",
      })
      .optional(),

    apply_email: z.email("Invalid email format").optional(),

    required_skills: z
      .array(z.string().min(1, { message: "Skill cannot be empty" }))
      .min(1, { message: "At least one skill is required" })
      .optional(),

    status: z.enum(["pending", "applied", "shortlisted"]).optional(),
  })
  .refine(
    (data) => {
      if (!data.apply_date || !data.last_date) return true; // skip যদি না থাকে

      return new Date(data.last_date) >= new Date(data.apply_date);
    },
    {
      message: "Last date cannot be before apply date",
      path: ["last_date"],
    },
  );
