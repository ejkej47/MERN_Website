const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

// 📌 REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Korisnik već postoji!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO "User" (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    return res.status(201).json({ message: "Registrovanje uspešno!" });
  } catch (err) {
    console.error("Greška pri registraciji korisnika:", err);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

// 📌 LOGIN
exports.login = async (req, res) => {
  const { email, password: inputPassword } = req.body;

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.password) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka." });
    }

    const isMatch = await bcrypt.compare(inputPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(
      'UPDATE "User" SET "refreshToken" = $1 WHERE id = $2',
      [refreshToken, user.id]
    );

    res.status(200).json({
      message: "Uspešna prijava!",
      user: {
        id: user.id,
        email: user.email
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

// 📌 REFRESH
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: "Nema refresh tokena." });

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [payload.id]);
    const user = result.rows[0];

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Nevažeći refresh token." });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

// 📌 LOGOUT
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(204).json({ message: "Već ste odjavljeni." });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    await pool.query(
      'UPDATE "User" SET "refreshToken" = $1 WHERE id = $2',
      ["", payload.id]
    );

    return res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch (err) {
    console.error("❌ Greška u logout token verifikaciji:", err.message);
    return res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

// 📌 PROTECTED TEST
exports.protectedRoute = (req, res) => {
  res.json({ message: `Zdravo ${req.user.email}, uspešno si pristupio.` });
};
