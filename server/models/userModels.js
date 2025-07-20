import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verifyOtp: {
      type: String,
      default: "",
      select: false,
    },
    verifyOtpExpireAt: {
      type: Date,
      default: null,
      select: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    resetOtp: {
      type: String,
      maxlength: 6,
      default: "",
      select: false,
    },
    resetOtpExpireAt: {
      type: Date,
      default: null,
      select: false,
    },
    twoFactorOtp: {
      type: String,
      maxlength: 6,
      default: "",
      select: false,
    },
    twoFactorOtpExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    refreshToken: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ userId: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
