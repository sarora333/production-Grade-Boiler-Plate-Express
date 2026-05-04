import app from "./app.js";
import connectDB from "./src/config/connectdb.js";
import { env } from "./src/config/env.js";
import logger from "./src/utils/logger.js";

// 1. Handle Uncaught Exceptions (Synchronous errors)
// Example: console.log(x) where x is not defined
process.on("uncaughtException", (err) => {
  logger.fatal("💥 UNCAUGHT EXCEPTION! Shutting down...");
  logger.error(err.name, err.message, err.stack);
  process.exit(1);
});

// 2. Bootstrap: Connect to DB, then start server
const startServer = async () => {
  await connectDB();

  const port = env.PORT || 8000;
  const server = app.listen(port, () => {
    logger.info(`🚀 Server is running in ${env.NODE_ENV} mode`);
    logger.info(`📡 URL: http://localhost:${port}`);
  });

  // 3. Handle Unhandled Rejections (Asynchronous errors)
  // Example: A failed database query without a .catch() block
  process.on("unhandledRejection", (err) => {
    logger.fatal("💥 UNHANDLED REJECTION! Shutting down...");
    logger.error(err.name, err.message);

    // Gracefully close the server before exiting
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
