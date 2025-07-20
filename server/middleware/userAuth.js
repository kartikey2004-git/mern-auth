import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const userAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized - No token");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized - User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized - Invalid/Expired token");
  }
});

export default userAuth;
