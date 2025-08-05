const pool = require("../db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

const isProduction = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// 📧 Promena emaila (autentifikovan korisnik)
exports.changeEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req.user?.id;

  try {
    await pool.query('UPDATE "User" SET email = $1 WHERE id = $2', [email, userId]);

    // 🔁 Dohvati novog korisnika
    const result = await pool.query('SELECT id, email FROM "User" WHERE id = $1', [userId]);
    const updatedUser = result.rows[0];

    // 🔐 Regeneriši access token
    const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    // 📤 Pošalji novi token u httpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Email promenjen i token osvežen." });
  } catch (err) {
    console.error("Greška pri promeni emaila:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

// 🔒 Promena lozinke (autentifikovan korisnik)
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.id;

  try {
    const result = await pool.query('SELECT password, email FROM "User" WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Stara lozinka nije tačna." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE "User" SET password = $1 WHERE id = $2', [hashed, userId]);

    // 🔐 Regeneriši token da ne koristimo stari
    const token = jwt.sign({ id: userId, email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Lozinka uspešno promenjena i token osvežen." });
  } catch (err) {
    console.error("Greška pri promeni lozinke:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

// 📨 Zahtev za reset lozinke (email + kod)
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
    console.error("Greška pri slanju koda:", err);
    res.status(500).json({ message: "Greška pri slanju emaila." });
  }
};

// ✅ Verifikacija koda i nova lozinka
exports.verifyResetCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM "PasswordResetToken" WHERE email = $1 AND code = $2 AND "expiresAt" > NOW() LIMIT 1',
      [email, code]
    );
    const token = result.rows[0];

    if (!token) return res.status(400).json({ message: "Nevažeći ili istekao kod." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE "User" SET password = $1 WHERE email = $2', [hashedPassword, email]);
    await pool.query('DELETE FROM "PasswordResetToken" WHERE email = $1', [email]);

    res.json({ message: "Lozinka uspešno resetovana." });
  } catch (err) {
    console.error("Greška pri resetovanju lozinke:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};
