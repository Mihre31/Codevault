import { Resend } from "resend";
import { ENV } from "../config/env.js";

const resend = ENV.RESEND_API_KEY ? new Resend(ENV.RESEND_API_KEY) : null;

async function sendEmail(payload) {
  const { data, error } = await resend.emails.send(payload);

  if (error) {
    throw new Error(error.message || "Email provider rejected the request");
  }

  return data;
}

export async function sendWelcomeEmail({ fullName, to }) {
  if (ENV.NODE_ENV === "development" && ENV.SEND_EMAILS !== "true") {
    console.log(`Email skipped in development for ${to}`);
    return null;
  }

  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM}>`;
  const appUrl = ENV.CLIENT_URL;
  try {
    return sendEmail({
      from,
      to,
      subject: "Welcome to CodeVault",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h1>Welcome to CodeVault, ${fullName}</h1>
        <p>Your account is ready. You can now save, organize, and reuse your code snippets.</p>
        <p>
          <a href="${appUrl}" style="color: #0f172a; font-weight: 700;">
            Open CodeVault
          </a>
        </p>
      </div>
    `,
    });
  } catch (error) {
    console.error(`Failed to send welcome email to ${to}:`, error.message);
    throw error; // Re-throw so caller can handle
  }
}

export async function sendPasswordResetEmail({ fullName, resetUrl, to }) {
  if (ENV.NODE_ENV === "development" && ENV.SEND_EMAILS !== "true") {
    console.log(`Password reset email skipped in development for ${to}`);
    return null;
  }

  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM}>`;

  try {
    const result = await sendEmail({
      from,
      to,
      subject: "Reset your CodeVault password",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h1>Password reset request</h1>
        <p>Hello ${fullName},</p>
        <p>Use the link below to choose a new CodeVault password. This link expires in 15 minutes.</p>
        <p>
          <a href="${resetUrl}" style="color: #0f172a; font-weight: 700;">
            Reset password
          </a>
        </p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
    });

    console.log("Password reset email accepted by Resend:", {
      id: result?.id,
    });

    return result;
  } catch (error) {
    console.error("Password reset email failed:", {
      message: error.message,
    });
    throw error;
  }
}
