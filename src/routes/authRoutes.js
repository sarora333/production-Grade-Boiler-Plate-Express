import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
} from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { userSchema, loginSchema } from "../validators/userValidator.js";
import authenticate from "../middlewares/auth.js";

const router = express.Router();

// ── Public Routes ────────────────────────────────────────────────────────────
// No token required
router.post("/register", validate(userSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refresh);

// ── Private Routes ───────────────────────────────────────────────────────────
// Requires valid Access Token
router.post("/logout", authenticate, logout);
router.get("/profile", authenticate, getProfile);

export default router;
