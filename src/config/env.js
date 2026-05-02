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
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET should be at least 32 characters for security"),
  JWT_EXPIRES_IN: z.string().default("7d"),

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
