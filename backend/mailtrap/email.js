import { sub } from "framer-motion/client";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  // console.log("Recipient email:", recipient);
  // console.log("Verification token:", verificationToken);
  

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify Your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    return response;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendEmail = async ({to,subject, html}) => {  
const recipient = [{email:to }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: subject,
      html: html,
    });

    return response;
  } catch (error) {
    console.error("Error sending contact message:", error);
    throw new Error("Failed to send contact message.");
  }
};

export const sendWelcomeEmail = async (email, firstName) => {
  const recipients = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      template_uuid: "8d0c6679-92a6-4dab-aa4d-54971ea7a677",
      template_variables: {
        company_info_name: "NetWit",
        name: firstName,
      },
    });
    return response;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Reset Password"
    });
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {  // Removed unused resetURL parameter
  const recipient = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset"
    });
    return response;
  } catch (error) {
    console.error("Error sending reset success email:", error);
    throw new Error("Failed to send reset success email");
  }
};


