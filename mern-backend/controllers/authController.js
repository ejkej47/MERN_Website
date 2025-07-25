const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

// 📌 REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (result.rows.length > 0)
      return res.status(400).json({ message: "Korisnik već postoji!" });

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

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query('UPDATE "User" SET "refreshToken" = $1 WHERE id = $2', [refreshToken, user.id]);

    // ✅ Postavi kao HttpOnly cookies
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
    });

    const { password, refreshToken: _, ...safeUser } = user;

    res.status(200).json({
      message: "Uspešna prijava!",
      user: safeUser
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

// 📌 LOGOUT
exports.logout = async (req, res) => {
  console.log("📥 Cookies primljeni u logout:", req.cookies); // 🟡 1. Prikaži sve cookie-je

  const token = req.cookies.refreshToken;
  console.log("🔑 Dobijen refreshToken:", token); // 🟡 2. Prikaži vrednost tokena

  if (!token) {
    clearAllCookies(res);
    return res.status(204).json({ message: "Već ste odjavljeni." });
  }

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET); // 🟡 3. Može da baci grešku
    console.log("✅ Validan payload iz tokena:", payload); // 🟡 4. Vidi šta sadrži

    await pool.query(
      'UPDATE "User" SET "refreshToken" = $1 WHERE id = $2',
      ["", payload.userId]
    );

    clearAllCookies(res);
    return res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch (err) {
    console.error("❌ Logout token error:", err.message); // 🟡 5. Ako je token nevalidan
    clearAllCookies(res);
    return res.status(204).json({ message: "Već ste odjavljeni." });
  }
};


// ✅ Helper funkcija
function clearAllCookies(res) {
  const options = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    path: "/", // ⬅️ OBAVEZNO
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  res.clearCookie("_csrf", options); // ako koristiš CSRF middleware
}


// 📌 REFRESH
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

    res.cookie("accessToken", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Access token osvežen." });
  } catch {
    res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

// 📌 PROTECTED TEST
exports.protectedRoute = (req, res) => {
  res.json({ message: `Zdravo ${req.user.email}, uspešno si pristupio.` });
};
