import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { JobController } from "./job.controller";
import {
  jobValidationSchema,
  updateJobValidationSchema,
} from "./job.validation";

const router = Router();
const auth = checkAuth();

router.post(
  "/create",
  auth,
  validateRequest(jobValidationSchema),
  JobController.create,
);

router.get("/", auth, JobController.getAllJobs);
router.patch(
  "/:id",
  auth,
  validateRequest(updateJobValidationSchema),
  JobController.updateJob,
);
router.delete("/:id", auth, JobController.deleteJob);
export const JobRoutes = router;
