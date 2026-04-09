import dotenv from 'dotenv';
import path from 'path';

// Load the environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Validate that required env vars exist
if (!config.mongodbUri) {
  console.error("FATAL ERROR: MONGODB_URI is not defined.");
  process.exit(1);
}

if (!config.jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

export default config;
