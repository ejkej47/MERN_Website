const { generateAccessToken } = require("../utils/token");
const pool = require("../db");

exports.facebookLogin = (req, res, next) => {
  // samo pokreće auth
  next();
};

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
      return res.status(400).json({ status: "error", message: "Missing fb_user_id" });
    }

    // Obrisi korisnika iz baze
    await pool.query('DELETE FROM "User" WHERE "facebookId" = $1', [fbUserId]);

    // Vrati potvrdu
    return res.json({
      url: `${process.env.CLIENT_URL || "https://tvoj-domen.com"}/privacy-policy#data-deletion`,
      status: "success",
      message: "User data deleted"
    });
  } catch (err) {
    console.error("Error deleting Facebook user data:", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};