import dotenv from "dotenv";
import path from "path";

// Load the environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  port: process.env.PORT || 5000,
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tiki-topple",
  jwtSecret: process.env.JWT_SECRET || "local-dev-secret",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

// Validate that critical env vars exist in non-development modes
if (config.nodeEnv === "production") {
  if (!process.env.MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in Production.");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in Production.");
    process.exit(1);
  }
} else {
  // In development, just warn if they are using defaults
  if (!process.env.MONGODB_URI) {
    console.warn(
      "WARNING: MONGODB_URI not found. Using local developer default: " +
        config.mongodbUri,
    );
  }
  if (!process.env.JWT_SECRET) {
    console.warn(
      "WARNING: JWT_SECRET not found. Using insecure fallback for development.",
    );
  }
}

export default config;
