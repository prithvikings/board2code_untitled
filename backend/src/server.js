import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/env.js";
import { setupSocket } from "./socket.js";

let server;

mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log("Connected to MongoDB");

    // We attach it to pure app.listen. It returns http.Server.
    server = app.listen(config.port, "0.0.0.0", () => {
      console.log(
        `Listening on port ${config.port} in ${config.nodeEnv} mode (All Interfaces)`,
      );
    });

    // Initialize Socket.IO
    setupSocket(server, config);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error("Unexpected error:", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// Optional: Handle graceful shutdown for SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
