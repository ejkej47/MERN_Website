const crypto = require("crypto");
const nodemailer = require("nodemailer");
const pool = require("../db");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

exports.requestReset = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: "Korisnik nije pronađen." });

    const code = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'INSERT INTO "PasswordResetToken" (email, code, "expiresAt") VALUES ($1, $2, $3)',
      [email, code, expiresAt]
    );

    await transporter.sendMail({
      from: `"Learnify" <${EMAIL_USER}>`,
      to: email,
      subject: "Zahtev za resetovanje lozinke",
      html: `<p>Vaš kod za resetovanje lozinke je:</p><h2>${code}</h2><p>Važi 15 minuta.</p>`,
    });

    res.json({ message: "Kod je poslat na email." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri slanju emaila." });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM "PasswordResetToken" WHERE email = $1 AND code = $2 AND "expiresAt" > NOW() LIMIT 1',
      [email, code]
    );
    const token = result.rows[0];

    if (!token) return res.status(400).json({ message: "Nevažeći ili istekao kod." });

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE "User" SET password = $1 WHERE email = $2', [hashedPassword, email]);
    await pool.query('DELETE FROM "PasswordResetToken" WHERE email = $1', [email]);

    res.json({ message: "Lozinka uspešno resetovana." });
  } catch (err) {
    res.status(500).json({ message: "Greška na serveru." });
  }
};