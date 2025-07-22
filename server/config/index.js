export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",

  db: {
    uri: process.env.MONGODB_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },

  mail: {
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASSWORD,
    senderEmail: process.env.SENDER_EMAIL,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  cors: {
    allowedOrigins: "http://localhost:5173",
  },
};