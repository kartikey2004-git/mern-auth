import transporter from "../config/nodemailer.js";
import { User } from "../models/userModels.js";
import { ApiError } from "../utils/ApiError.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/EmailTemplate.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const register = asyncHandler(async (req, res) => {
  // 1. Get user input from req.body
  const { name, email, password } = req.body;

  // 2. Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Missing required fields", [
      { field: "name / email / password", message: "All fields are mandatory" },
    ]);
  }

  // 3. Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // 4. Create new user (don't generate tokens here)
  const user = await User.create({
    name,
    email,
    password, // will be hashed in pre-save hook
  });

  // 7. Send welcome mail to registered user
  await transporter
    .sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to the club!",
      text: `Hey ${name},\n\nWelcome to our app! Your account has been created with the email: ${email}.\n\nEnjoy!`,
    })
    .catch((err) => {
      throw new ApiError(500, `Failed to send welcome email: ${err.message}`);
    });

  // 8. Remove sensitive fields (like refresh tokens) from response

  const createdUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully"
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required", [
      { field: "email / password", message: "Both fields are mandatory" },
    ]);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Invalid email address");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const isAuthenticated = asyncHandler(async (req, res) => {
  return res.status(201).json(new ApiResponse(201, null, "User authenticated"));
});

export const sendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Password Reset OTP",
    html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email
    ),
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(201)
    .json(new ApiResponse(201, null, "OTP sent to your email"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP and new password are required", [
      {
        field: "email / otp / newPassword",
        message: "All fields are mandatory",
      },
    ]);
  }

  const user = await User.findOne({ email }).select(
    "+resetOtp +resetOtpExpireAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.resetOtp || user.resetOtp !== otp) {
    throw new ApiError(401, "Invalid OTP");
  }

  if (user.resetOtpExpireAt < Date.now()) {
    throw new ApiError(410, "OTP has expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.resetOtp = "";
  user.resetOtpExpireAt = 0;
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Password has been reset successfully"));
});

export const sendVerifyOtp = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isAccountVerified) {
    return res.json({ success: false, message: "Account Already Verified" });
  }

  // Create a 6‑digit OTP and set its expiry (24h)

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  //  Prepare and send verification email

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Account Verification OTP",
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email
    ),
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Verification OTP sent to email"));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  //  Extract OTP from req.body
  const { otp } = req.body;

  // Extract user ID from auth middleware
  const userId = req.user?._id;

  if (!userId || !otp) {
    throw new ApiError(400, "User ID and OTP are required", [
      { field: "userId / otp", message: "Both fields are mandatory" },
    ]);
  }

  // Fetch user on basis of userID in database

  const user = await User.findById(userId).select(
    "+verifyOtp +verifyOtpExpireAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate OTP value

  if (!user.verifyOtp || user.verifyOtp !== otp) {
    throw new ApiError(401, "Invalid OTP");
  }

  // Validate OTP expiry

  if (user.verifyOtpExpireAt < Date.now()) {
    throw new ApiError(410, "OTP has expired");
  }

  // Mark account as verified and clear OTP fields

  user.isAccountVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = 0;

  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Email verified successfully"));
});
