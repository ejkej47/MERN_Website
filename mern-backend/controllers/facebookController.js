const { generateAccessToken } = require("../utils/token");
const pool = require("../db");
const passport = require("passport");

exports.facebookLogin = passport.authenticate("facebook", { scope: ["email"] });

exports.facebookAuthCallback = (req, res) => {
  const user = req.user;

  const token = generateAccessToken(user);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  // možeš redirect na dashboard ili home
  res.redirect(process.env.CLIENT_URL || "/");
};

exports.facebookDataDeletion = async (req, res) => {
  try {
    const fbUserId = req.query.fb_user_id;

   if (!fbUserId) {
      // Vrati informaciju, ali status 200
      return res.status(200).json({
        status: "info",
        message: "No Facebook User ID provided. Please contact support to request deletion.",
        contact: "support@tvoj-domen.com",
        url: `${process.env.CLIENT_URL || "https://tvoj-domen.com"}/privacy-policy#data-deletion`
      });
    }

    // Obrisi korisnika iz baze
    await pool.query('DELETE FROM "User" WHERE "facebookId" = $1', [fbUserId]);

    // Vrati potvrdu
    return res.json({
      url: `${process.env.CLIENT_URL || "/"}/privacy-policy#data-deletion`,
      status: "success",
      message: "User data deleted"
    });
  } catch (err) {
    console.error("Error deleting Facebook user data:", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

