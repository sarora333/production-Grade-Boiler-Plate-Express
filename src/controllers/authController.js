import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/apiRes.js";
import ApiError from "../utils/apiError.js";
import * as authService from "../services/authService.js";

// ── register ──────────────────────────────────────────────────────────────────
export const register = catchAsync(async (req, res) => {
  const { name, mobile, email, password } = req.body;

  const data = await authService.registerUser({
    name,
    mobile,
    email,
    password,
  });

  res.cookie("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json(new ApiResponse(201, data.user, "Registered successfully"));
});

// ── login ─────────────────────────────────────────────────────────────────────
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const data = await authService.loginUser({ email, password });

  res.cookie("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, data.user, "Login successful"));
});

// ── refresh access token ───────────────────────────────────────────────────────
export const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new ApiError("Refresh token is required", 400);

  const data = await authService.refreshAccessToken(refreshToken);

  res.status(200).json(new ApiResponse(200, data, "Access token refreshed"));
});

// ── logout ────────────────────────────────────────────────────────────────────
export const logout = catchAsync(async (req, res) => {
  await authService.logoutUser(req.user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// ── get profile ───────────────────────────────────────────────────────────────
export const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);

  res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});
