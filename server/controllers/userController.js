import { User } from "../models/userModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserData = asyncHandler(async (req, res) => {

  const userId = req.user?._id

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userData = {
    name: user.name,
    isAccountVerified: user.isAccountVerified,
    email: user.email
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userData, "User data fetched successfully"));
});
