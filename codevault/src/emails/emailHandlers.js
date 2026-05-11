import { resendClient, sender } from "../libs/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to codeVault",
    html: createWelcomeEmailTemplate(name, clientURL),
  });
  if (error) {
    console.error("Error sending welcome email");
    throw new Error("Failed to send welcome email");
  }
  console.log("Welcome message sent successfully", data);
};
