const passport = require("passport");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const isProduction = process.env.NODE_ENV === "production";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

const CLIENT_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://mern-website-nine.vercel.app";

// 1️⃣ OAuth login start
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"]
});

// 2️⃣ OAuth callback — vraća JSON umesto redirect
const googleAuthCallback = async (req, res) => {
   console.log("🔁 Google callback URL:", req.originalUrl); // <-- OVO DODAŠ
  try {
    const profile = req.user;

    if (!profile || typeof profile.googleId !== "string") {
      console.error("Nevalidan Google profil:", profile);
      return res.status(400).json({ message: "Nevalidan Google profil." });
    }

    const { email, image = "", googleId } = profile;

    let result = await pool.query('SELECT * FROM "User" WHERE "googleId" = $1', [googleId]);
    let user = result.rows[0];

    if (!user) {
      result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
      user = result.rows[0];

      if (user) {
        result = await pool.query(
          'UPDATE "User" SET "googleId" = $1, image = $2 WHERE email = $3 RETURNING *',
          [googleId, image, email]
        );
        user = result.rows[0];
      } else {
        result = await pool.query(
          'INSERT INTO "User" (email, "googleId", image, password) VALUES ($1, $2, $3, $4) RETURNING *',
          [email, googleId, image, ""]
        );
        user = result.rows[0];
      }
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query('UPDATE "User" SET "refreshToken" = $1 WHERE id = $2', [refreshToken, user.id]);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    if (!isProduction) {
      return res.redirect("http://localhost:5173/google-success");
    } else {
      return res.redirect(`${CLIENT_URL}/google-success`);
    }

  } catch (err) {
    console.error("Greška u Google auth callback:", err);
    res.status(500).json({ message: "Greška u Google prijavi." });
  }
};

module.exports = {
  googleLogin,
  googleAuthCallback,
};
