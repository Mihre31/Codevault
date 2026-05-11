import express from "express";
import { ENV } from "../config/env.js";
import {
  getMe,
  googleCallback,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${ENV.CLIENT_URL}?authError=google`,
    session: false,
  }),
  googleCallback,
);

export default router;
