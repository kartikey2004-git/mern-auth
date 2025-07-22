import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};


export const User = mongoose.model("User", userSchema)
