import mongoose from 'mongoose';
import app from './app.js';
import config from './config/env.js';

let server;

mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    server = app.listen(config.port, () => {
      console.log(`Listening on port ${config.port} in ${config.nodeEnv} mode`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Optional: Handle graceful shutdown for SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
