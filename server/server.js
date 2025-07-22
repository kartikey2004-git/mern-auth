import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";

import { config } from "./config/index.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import userRouter from "./routes/userRoutes.js";


const app = express();

connectDB();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

if (config.env !== "production") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use("/api/user", userRouter);

app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
