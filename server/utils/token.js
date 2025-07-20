import { User } from "../models/userModels.js";
import { ApiError } from "./ApiError.js";

export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push({ token: refreshToken });

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens", error);
  }
};
