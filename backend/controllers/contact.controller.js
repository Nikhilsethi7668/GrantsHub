import { sendEmail } from "../mailtrap/email.js";

export const contactUs = async (req, res) => {
  try {
    const { name, email, website, message } = req.body;

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailSubject = `New Contact Form Submission`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0;">New Contact Form Submission</h2>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Contact Details:</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Website:</strong> ${website}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #2c3e50;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Submission Details:</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>IP Address:</strong> ${req.ip}</p>
          <p style="margin: 5px 0;"><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This is an automated notification from the contact form. Please respond to the sender's email address directly.
          </p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} Grant App. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    // Send confirmation email to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0;">Thank You for Contacting Us</h2>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;">Dear ${name},</p>
          <p style="margin: 5px 0;">Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Your Message Details:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #2c3e50;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; color: #666;">
            If you have any additional information to add, please reply to this email.
          </p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} Grant App. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Thank you for contacting Grant App",
      html: userEmailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact form:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};
