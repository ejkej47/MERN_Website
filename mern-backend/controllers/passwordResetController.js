const PasswordResetToken = require("../models/PasswordResetToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

exports.sendResetCode = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(400).json({ message: "Nalog ne podržava reset lozinke." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  try {
    await PasswordResetToken.deleteMany({ email });
    await PasswordResetToken.create({ email, code, expiresAt });

    const plainText = `Your password reset code is: ${code}`;

const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2 style="color: #2c3e50;"> Reset your Learnify password</h2>
    <p>Hello,</p>
    <p>You requested to reset your password. Your one-time code is:</p>
    <h3 style="background: #f1f1f1; padding: 10px; text-align: center; letter-spacing: 2px;">${code}</h3>
    <p>This code will expire in 15 minutes.</p>
    <hr />
    <p style="font-size: 0.9em; color: #888;">
      If you didn’t request this, please ignore this email. <br/>
      Sent by <strong>Learnify App</strong><br/>
      © ${new Date().getFullYear()} Learnify. All rights reserved.
    </p>
  </div>
`;

await sendEmail(email, "Password Reset Code", plainText, htmlContent);
    res.json({ message: "Ako email postoji, kod je poslat." });
  } catch (err) {
    res.status(500).json({ message: "Greška na serveru." });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const tokenEntry = await PasswordResetToken.findOne({ email, code });

  if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Kod nije validan ili je istekao." });
  }

  res.json({ message: "Kod uspešno potvrđen." });
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const tokenEntry = await PasswordResetToken.findOne({ email, code });

  if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Kod nije validan ili je istekao." });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Korisnik ne postoji." });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await PasswordResetToken.deleteMany({ email });

  res.json({ message: "Lozinka uspešno promenjena." });
};
