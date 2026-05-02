import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { env } from "./env.js"; // Use the validated env object

const connectDB = async () => {
  try {
    // 1. Initial Connection
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected successfully");
    logger.info(`📦 Database: ${mongoose.connection.name}`);
    logger.info(`🔗 Host: ${mongoose.connection.host}`);
    logger.info(`🚪 Port: ${mongoose.connection.port}`);
  } catch (error) {
    logger.error("MongoDB initial connection error:", error);
    process.exit(1);
  }
};

// 2. Production Lifecycle Event Listeners
mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  logger.error("❌ MongoDB connection error:", err);
});

// 3. Graceful Shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("🛑 MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDB;
