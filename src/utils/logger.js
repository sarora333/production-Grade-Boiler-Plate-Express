import pino from "pino";
import { env } from "../config/env.js";

// Define the transport for "pretty" printing in development
const transport =
  env.NODE_ENV === "development"
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname", // Keeps logs clean
        },
      })
    : undefined;

const logger = pino(
  {
    level: env.LOG_LEVEL || "info",
    // In production, structured JSON is better for log aggregators
    base: {
      env: env.NODE_ENV,
    },
  },
  transport,
);

export default logger;
