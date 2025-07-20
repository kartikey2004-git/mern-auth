import transporter from "../config/nodemailer.js";
import { User } from "../models/userModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../utils/token.js";
import jwt from "jsonwebtoken";

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
  const newUser = await User.create({
    name,
    email,
    password, // will be hashed in pre-save hook
  });

  // 5. Generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    newUser._id
  );

  // 6. Send refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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

  const registeredUser = await User.findById(newUser._id).select(
    "-refreshToken"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: registeredUser, accessToken },
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

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "Invalid email address");
  }

  const isMatched = await user.isPasswordCorrect(password);

  if (!isMatched) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const loggedInUser = await User.findById(user._id).select("-refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User already logged out"));
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log("Refresh token invalid or expired:", err.message);

    return res.status(200).json({ message: "Logged out (invalid token)" });
  }

  const userId = decoded._id || decoded.userId;
  if (!userId) {
    console.log("Invalid token payload. userId not found.");
    return res.status(400).json({ message: "Invalid token structure" });
  }

  const user = await User.findById(userId);
  if (!user) {
    console.log("User not found during logout");
    return res.status(200).json({ message: "Logged out (user not found)" });
  }

  user.refreshToken = user.refreshToken.filter(
    (entry) => entry.token !== refreshToken
  );

  await user.save();
  console.log("Refresh token removed from DB");

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new ApiError(404, "User not found");

  const tokenExists = user.refreshToken.find(
    (entry) => entry.token === refreshToken
  );

  if (!tokenExists) {
    user.refreshToken = [];
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "Refresh token reuse detected. Logged out.");
  }

  user.refreshToken.pull({ token: refreshToken });

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken.push({ token: newRefreshToken });

  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed")
    );
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

// Validate OTP and mark user’s email as verified

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
