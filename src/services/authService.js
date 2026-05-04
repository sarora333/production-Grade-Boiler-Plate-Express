import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

const SALT_ROUNDS = 10;

// ── helper — builds token payload from user doc ───────────────────────────────
const buildPayload = (user) => ({
  id: user._id,
  name: user.name,
  mobile: user.mobile,
  email: user.email,
});

// ── register ──────────────────────────────────────────────────────────────────
export const registerUser = async ({ name, mobile, email, password }) => {
  // 1. check duplicate email
  const exists = await User.exists({ email });
  if (exists) throw new ApiError("Email already registered", 409);

  // 2. hash password — never store plain text
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. save user
  const user = await User.create({
    name,
    mobile,
    email,
    password: hashedPassword,
  });

  // 4. generate both tokens
  const accessToken = generateAccessToken(buildPayload(user));
  const refreshToken = generateRefreshToken({ id: user._id });

  // 5. persist refresh token in DB so logout can invalidate it
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

// ── login ─────────────────────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  // 1. find user (include password field for bcrypt compare)
  const user = await User.findOne({ email });

  // same error for wrong email OR wrong password — don't reveal which
  if (!user) throw new ApiError("Invalid email or password", 401);

  // 2. compare plain password against stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Invalid email or password", 401);

  // 3. generate fresh tokens on every login
  const accessToken = generateAccessToken(buildPayload(user));
  const refreshToken = generateRefreshToken({ id: user._id });

  // 4. overwrite old refresh token in DB with the new one
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

// ── refresh access token ───────────────────────────────────────────────────────
export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError("Refresh token required", 401);

  // 1. verify signature and expiry
  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new ApiError("Invalid or expired refresh token", 403);
  }

  // 2. match against DB — ensures logout actually invalidates it
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== incomingRefreshToken)
    throw new ApiError("Refresh token mismatch — please login again", 403);

  // 3. issue a new access token (refresh token stays the same)
  const accessToken = generateAccessToken(buildPayload(user));

  return { accessToken };
};

// ── logout ────────────────────────────────────────────────────────────────────
export const logoutUser = async (userId) => {
  // wipe refresh token from DB — makes it permanently invalid
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// ── get profile ───────────────────────────────────────────────────────────────
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -refreshToken") // never send these to client
    .lean();

  if (!user) throw new ApiError("User not found", 404);
  return user;
};
