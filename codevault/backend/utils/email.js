import { Resend } from "resend";
import { ENV } from "../config/env.js";

const resend = ENV.RESEND_API_KEY ? new Resend(ENV.RESEND_API_KEY) : null;

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
    return resend.emails.send({
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
