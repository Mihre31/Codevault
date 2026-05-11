import mongoose from "mongoose";
import { ENV } from "./env.js";

export default async function connectDB() {
  try {
    const connection = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}
