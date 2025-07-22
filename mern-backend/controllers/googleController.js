const passport = require("passport");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const prisma = new PrismaClient();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

// === Pokreće Google login
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"]
});

// === Callback nakon uspešnog logovanja
const googleAuthCallback = async (req, res) => {
  try {
    const profile = req.user;

  if (!profile || typeof profile.googleId !== "string") {
   console.error("Nevalidan profil ili profil.id nije string:", profile);
   return res.redirect("http://localhost:3000/login-failure");
  }

    let user = await prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    // Ako korisnik sa tim googleId ne postoji
    if (!user) {
      // Proveri da li postoji korisnik sa istim emailom
      user = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });

      if (user) {
        // Dodaj googleId postojećem korisniku
        user = await prisma.user.update({
          where: { email: profile.emails[0].value },
          data: {
            googleId: profile.id,
            image: profile.photos?.[0]?.value || "",
          },
        });
      } else {
        // Ako korisnik ne postoji, kreiraj ga
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            googleId: profile.id,
            image: profile.photos?.[0]?.value || "",
            password: "", // prazna lozinka za OAuth
          },
        });
      }
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Sačuvaj refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Pošalji refreshToken kao HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true ako koristiš HTTPS
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirekcija na frontend
    res.redirect(
      `http://localhost:3000/login-success?token=${token}&email=${user.email}&image=${user.image || ""}`
    );
  } catch (err) {
    console.error("Greška u Google auth callback:", err);
    res.redirect("http://localhost:3000/login-failure");
  }
};

module.exports = {
  googleLogin,
  googleAuthCallback,
};
