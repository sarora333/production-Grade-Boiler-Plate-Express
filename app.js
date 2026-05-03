import express from "express";
import path from "node:path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./src/middlewares/errorMiddleware.js";
import { env } from "./src/config/env.js";

const app = express();

// Trust proxy is required if you are behind a reverse proxy (Heroku, Render, Nginx)
// Otherwise rateLimit will block everyone if one person exceeds the limit.
app.set("trust proxy", 1);

const absolutePath = path.join(import.meta.dirname, "views");
const publicPath = path.join(import.meta.dirname, "public");

app.set("view engine", "ejs");
app.set("views", absolutePath);

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. Cross-Origin Resource Sharing (Uses validated env variable)
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Prevent HTTP parameter pollution
app.use(hpp());

// Compress responses
app.use(compression());
app.use(cookieParser());

// 3. Request Logging
// Use 'dev' format in development, 'combined' (more detailed) in production
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// 4. Rate Limiting (Prevent Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// 5. Body Parsers
app.use(express.json({ limit: "16kb" })); // Limit body size to prevent DOS
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(publicPath));

//home route
app.get("/", (req, res) => {
  res.render("home");
});

// 6. 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).render("404");
});

// 7. Global Error Handler (MUST be last)
app.use(globalErrorHandler);

export default app;
