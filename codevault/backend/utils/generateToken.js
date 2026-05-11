import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export default function generateToken(userId, res) {
  const token = jwt.sign({ id: userId }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: ENV.NODE_ENV === "production",
  });

  return token;
}
