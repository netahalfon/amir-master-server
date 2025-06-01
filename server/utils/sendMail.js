//utils/sendMail.js

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function sendEmail(userEmail) {
  console.log("Start bilding email to: ", userEmail);
  //הגדרת חשבון המייל השולח

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  // יצירת טוקן זמני
  const resetToken = jwt.sign(
    { email: userEmail },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "15m" }
  );
  //כתובת הקישור
  const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

  // הגדרת  המייל
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Password Recovery - AmirMaster",
    html: `
    <p>You requested to reset your password.</p>
    <p><a href="${resetLink}">Click here to reset your password</a></p>
    <p>This link is valid for 15 minutes.</p>
    `,
  };

  try {
    // שליחת המייל
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}

module.exports = sendEmail;
