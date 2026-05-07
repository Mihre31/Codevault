import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import snippetRoutes from "./routes/snippet.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ message: "CodeVault API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
