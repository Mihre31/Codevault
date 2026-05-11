import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import snippetRoutes from "./routes/snippet.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();
const port = ENV.PORT;

app.use(
  cors({
    origin: ENV.CLIENT_URL,
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
