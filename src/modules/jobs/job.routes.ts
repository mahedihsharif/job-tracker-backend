import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { JobController } from "./job.controller";
import { jobValidationSchema } from "./job.validation";

const router = Router();
const auth = checkAuth();

router.post(
  "/create",
  auth,
  validateRequest(jobValidationSchema),
  JobController.create,
);

export const JobRoutes = router;
