// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text, html) {
  await transporter.sendMail({
    from: `"Learnify Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html, // dodato
  });
}

module.exports = sendEmail;
