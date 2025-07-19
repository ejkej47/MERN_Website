const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authenticateToken = require("../middleware/authMiddleware");
require("dotenv").config();

const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";
const refreshTokens = new Map();

router.use(cookieParser());


passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

// === Register ===
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Korisnik već postoji!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Registrovanje uspešno!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Login ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Pogrešan email ili lozinka." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Pogrešan email ili lozinka." });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Uspešna prijava!",
      token,
      user: {
        email: user.email,
        image: user.image || "",
        googleId: user.googleId || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Google OAuth ===
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = generateAccessToken(req.user);
      const refreshToken = generateRefreshToken(req.user);

      // Čuvanje refresh tokena u bazi
      req.user.refreshToken = refreshToken;
      await req.user.save();

      // Postavljanje refresh tokena kao HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // stavi true ako koristiš HTTPS
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
      });

      // Redirekcija sa tokenom i korisničkim podacima
      res.redirect(
        `http://localhost:3000/login-success?token=${token}&email=${req.user.email}&image=${req.user.image || ""}`
      );
    } catch (err) {
      console.error("Greška prilikom Google prijave:", err);
      res.redirect("/login");
    }
  }
);


// === Refresh Token Route ===
router.post("/refresh-token", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Nema refresh tokena." });

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Nevažeći refresh token." });
    }

    const newToken = generateAccessToken(user);
    res.json({ token: newToken });
  } catch (err) {
    return res.status(403).json({ message: "Nevažeći refresh token." });
  }
});


// === Protected Route Example ===
router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: `Zdravo ${req.user.email}, uspešno si pristupio zaštićenoj ruti!`,
  });
});

// Logout ruta
router.post("/logout", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(204).json({ message: "Već ste odjavljeni." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);

    if (user) {
      user.refreshToken = ""; // briši refresh token iz baze
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false, // u produkciji stavi true ako koristiš HTTPS
    });

    res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch (err) {
    console.error("Logout error: Nevažeći ili istekao refresh token.", err);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    });

    // Umesto 403, šalji 204 jer ionako brišeš kolačić i korisnik je odjavljen
    res.status(204).json({ message: "Već ste odjavljeni." });
  }
});





module.exports = router;
