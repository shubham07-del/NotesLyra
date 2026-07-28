const apiInstance = require("./brevo");

const sendVerificationEmail = async (email, verificationLink) => {
  const sendSmtpEmail = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: "Nursing Vidya",
    },
    to: [
      {
        email,
      },
    ],
    subject: "Verify your Email - Nursing Vidya",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to Nursing Vidya!</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">
          Thank you for signing up. Please verify your email address to get started.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${verificationLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          If you didn't create an account with us, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const response = await apiInstance.transactionalEmails.sendTransacEmail(sendSmtpEmail);
    console.log(response);
  } catch (err) {
    console.log(err.response?.body || err);
  }
};

module.exports = sendVerificationEmail;