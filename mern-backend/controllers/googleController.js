const passport = require("passport");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"]
});

const googleAuthCallback = async (req, res) => {
  try {

    const profile = req.user;
    console.log("PROFILE IZ GOOGLE CALLBACKA:", profile);

    if (!profile || typeof profile.googleId !== "string") {
      console.error("Nevalidan profil ili profil.id nije string:", profile);
      return res.redirect("http://localhost:3000/login-failure");
    }

    const email = profile.email;
    const image = profile.image || "";
    const googleId = profile.googleId;


    // Proveri da li postoji korisnik sa tim googleId
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

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query('UPDATE "User" SET "refreshToken" = $1 WHERE id = $2', [refreshToken, user.id]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

    res.redirect(
      `${CLIENT_URL}/login-success?token=${token}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(user.image || "")}&googleId=${user.googleId || ""}`
    );

  } catch (err) {
    console.error("Greška u Google auth callback:", err);
    res.redirect(`${CLIENT_URL}/login-failure`);
  }
};

module.exports = {
  googleLogin,
  googleAuthCallback,
};
