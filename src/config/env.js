import { z } from "zod";
import "dotenv/config"; // Automatically loads your .env file

const envSchema = z.object({
  // 1. Core App Settings
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("8000"),

  // 2. Database
  MONGO_URI: z
    .string()
    .min(1, "MONGO_URI is required for the database connection"),

  // 3. Security (JWT)
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(
      32,
      "ACCESS_TOKEN_SECRET should be at least 32 characters for security",
    ),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(
      32,
      "REFRESH_TOKEN_SECRET should be at least 32 characters for security",
    ),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

  // 4. CORS
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),

  // 5. Logging
  LOG_LEVEL: z
    .enum(["info", "error", "warn", "debug", "fatal"])
    .default("info"),
});

// Validate process.env against the schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid Environment Variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1); // Stop the server if variables are missing
}

export const env = _env.data;

export const {
  NODE_ENV,
  PORT,
  MONGO_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  CORS_ORIGIN,
  LOG_LEVEL,
} = env;
