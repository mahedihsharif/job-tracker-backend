import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { JobRoutes } from "../modules/jobs/job.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/jobs",
    route: JobRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
