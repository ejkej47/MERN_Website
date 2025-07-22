const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Provera da li korisnik već postoji
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (result.rows.length > 0) 
      return res.status(400).json({ message: "Korisnik već postoji!" });

    // Hashiranje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ubacivanje novog korisnika
    await pool.query('INSERT INTO "User" (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    // Uspešan odgovor
    return res.status(201).json({ message: "Registrovanje uspešno!" });
  } catch (err) {
    console.error("Greška pri registraciji korisnika:", err);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for:", email);

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    console.log("User query result:", result.rows);

    const user = result.rows[0];
    if (!user || !user.password) {
      console.log("User not found or password missing");
      return res.status(401).json({ message: "Pogrešan email ili lozinka." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka." });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("Tokens generated");

    if (!token || !refreshToken) {
      console.error("Token generation failed");
      return res.status(500).json({ message: "Greška na serveru." });
    }

    await pool.query('UPDATE "User" SET "refreshToken" = $1 WHERE id = $2', [refreshToken, user.id]);
    console.log("Refresh token updated in DB");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Uspešna prijava!",
      token,
      user: {
        email: user.email,
        image: user.image || "",
        googleId: user.googleid || "",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};



exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(204).json({ message: "Već ste odjavljeni." });

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    await pool.query('UPDATE "User" SET "refreshToken" = $1 WHERE id = $2', ["", payload.userId]);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    });

    res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch {
    res.clearCookie("refreshToken");
    res.status(204).json({ message: "Već ste odjavljeni." });
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Nema refresh tokena." });

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [payload.userId]);
    const user = result.rows[0];

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Nevažeći refresh token." });
    }

    const newToken = generateAccessToken(user);
    res.json({ token: newToken });
  } catch {
    res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

exports.protectedRoute = (req, res) => {
  res.json({ message: `Zdravo ${req.user.email}, uspešno si pristupio.` });
};
