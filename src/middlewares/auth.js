import { verifyAccessToken } from "../utils/token.js";
import ApiError from "../utils/apiError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Check header first, then cookies
  const authHeader = req.headers["authorization"];
  let token = authHeader?.split(" ")[1];

  if (!token && req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError("Access token missing", 401);
  }

  // Verify signature and expiry (throws if invalid/expired)
  // catchAsync will catch any JWT errors and pass them to global handler
  const decoded = verifyAccessToken(token);

  // Attach decoded payload to req so controllers can use it
  req.user = decoded; // {id, name, email, iat, exp}
  next();
});

export default authenticate;
