/**
 * server.js — Entry point
 * Loads environment variables, connects to MongoDB, starts the HTTP server.
 */

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

let server;

// Connect to MongoDB then start the server
connectDB().then(() => {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 API Base: http://0.0.0.0:${PORT}/api\n`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

// Graceful shutdown helper for Elastic Beanstalk and Docker containers
const gracefulShutdown = (signal) => {
  console.log(`\n⚠️ ${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('🔒 HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        console.log('📦 MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB disconnect:', err.message);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err ? err.message : err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err ? err.message : err);
  process.exit(1);
});
