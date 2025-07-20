import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config.js";

import { config } from "./config/index.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

if (config.env !== "production") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || config.cors.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working fine!",
    environment: config.env,
  });
});

app.use("/api/auth", authRouter);

app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
