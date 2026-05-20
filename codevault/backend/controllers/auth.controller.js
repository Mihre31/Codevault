import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/email.js";
import generateToken from "../utils/generateToken.js";

export async function signup(req, res) {
  const { fullName, name, email, password } = req.body;
  const displayName = fullName || name;

  try {
    if (!displayName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (user?.password) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user?.googleId) {
      user.fullName = user.fullName || displayName;
      user.password = hashedPassword;
      await user.save();

      const token = generateToken(user._id, res);

      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        token,
      });
    }

    const newUser = new User({
      fullName: displayName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    await newUser.save();
    const token = generateToken(newUser._id, res);

    try {
      await sendWelcomeEmail({
        fullName: newUser.fullName,
        to: newUser.email,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    return res.status(500).json({
      message: "Internal server error",
      error: ENV.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account does not have a password yet. Use forgot password to set one, or sign in with Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    return res.status(500).json({
      message: "Internal server error",
      error: ENV.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("+password");

    // Keep the response generic so callers cannot discover registered emails.
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${ENV.CLIENT_URL}?resetToken=${resetToken}`;

    try {
      await sendPasswordResetEmail({
        fullName: user.fullName,
        resetUrl,
        to: user.email,
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      throw emailError;
    }

    return res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.log("Error in forgot password controller", error);
    return res.status(500).json({
      message: "Unable to send reset email",
      error: ENV.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpiresAt");

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in reset password controller", error);
    return res.status(500).json({
      message: "Internal server error",
      error: ENV.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

export function logout(req, res) {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure: ENV.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logged out successfully" });
}

export function getMe(req, res) {
  return res.status(200).json({
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    profilePic: req.user.profilePic,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
}

export function googleCallback(req, res) {
  const token = generateToken(req.user._id, res);

  return res.redirect(`${ENV.CLIENT_URL}?token=${encodeURIComponent(token)}`);
}
