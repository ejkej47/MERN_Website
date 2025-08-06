const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

const isProduction = process.env.NODE_ENV === "production";
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
    const insertResult = await pool.query(
      'INSERT INTO "User" (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    const newUser = insertResult.rows[0];

    // 📌 Dodaj odmah token-e (kao kod login-a)
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    await pool.query(
      'UPDATE "User" SET "refreshToken" = $1 WHERE id = $2',
      [refreshToken, newUser.id]
    );

    // 📌 Postavi cookie-e
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 15, // 15 minuta
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dana
    });

    return res.status(201).json({
      message: "Registrovanje uspešno!",
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Greška pri registraciji korisnika:", err);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};


// 📌 LOGIN — koristi httpOnly cookies
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
    });

    res.status(200).json({
      message: "Uspešna prijava!",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

// 📌 REFRESH — koristi httpOnly cookie, ne čita iz body
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Nema refresh tokena." });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [payload.id]);
    const user = result.rows[0];

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Nevažeći refresh token." });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token osvežen." });
  } catch (err) {
    console.error("Greška u refreshToken:", err.message);
    return res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

// 📌 LOGOUT — briše refreshToken iz baze i cookie-je
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(204).json({ message: "Već ste odjavljeni." });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    await pool.query(
      'UPDATE "User" SET "refreshToken" = $1 WHERE id = $2',
      ["", payload.id]
    );

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    return res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch (err) {
    console.error("❌ Greška u logout token verifikaciji:", err.message);
    return res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

// 📌 Zaštićena ruta — primer
exports.protectedRoute = (req, res) => {
  res.json({ message: `Zdravo ${req.user.email}, uspešno si pristupio.` });
};
