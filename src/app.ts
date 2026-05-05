import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import env from "./config/env.config";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
import { router } from "./routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Job Tracker Application🤯");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
