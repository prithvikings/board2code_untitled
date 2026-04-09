import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  errorConverter,
  errorHandler,
} from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";
import authRoutes from "./routes/auth.routes.js";
import config from "./config/env.js";

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse generic JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: config.frontendUrl, // Dynamically loaded cleanly
    credentials: true, // Allow cookies to be sent along with requested
  }),
);

// API Routes
app.use("/api/v1/auth", authRoutes);

// General route for sanity check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Match any 404 errors locally
app.use((req, res, next) => {
  next(new ApiError(404, "Route Not found"));
});

// Convert errors to ApiError, if not already
app.use(errorConverter);

// Centralized error handler
app.use(errorHandler);

export default app;
