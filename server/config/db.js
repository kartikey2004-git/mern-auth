import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import { config } from "./index.js";

const connectDB = async () => {
  try {
    const mongoURI = `${config.db.uri}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAILED\n", error);
    process.exit(1);
  }
};

export default connectDB;
