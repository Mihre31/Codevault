import "dotenv/config";

export const ENV = {
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  EMAIL_FROM: process.env.EMAIL_FROM || "onboarding@resend.dev",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "CodeVault",
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/auth/google/callback",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SEND_EMAILS: process.env.SEND_EMAILS || "false",
};
