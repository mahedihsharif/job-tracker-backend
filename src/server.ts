import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import env from "./config/env.config";

let server: Server;

const startServer = async () => {
  console.log("Starting server...");
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Port: ${env.PORT}`);
  console.log(`Database URL: ${env.MONGODB_URI ? "Set" : "Not set"}`);
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB Connection Successful!✅");
    server = app.listen(env.PORT, () => {
      console.log(`Server is Listening at PORT: ${env.PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed!❌", error);
  }
};

startServer();

/**
 * unhandled rejection
 * uncaught rejection
 * Signal Terminal Rejection
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection Detected...Sever is Shutting Down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception Detected...Server is shutting Down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("Signal Terminal Detected...Server is Shutting down.");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT Detected...Server is Shutting down.");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
