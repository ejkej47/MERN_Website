const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;
  console.log("🔑 accessToken:", token); // Dodaj ovo

  if (!token) {
    return res.status(401).json({ message: "Niste prijavljeni (token nedostaje)." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("⛔ Greška pri verifikaciji tokena:", err.message); // Dodaj
      return res.status(403).json({ message: "Nevažeći token." });
    }
    
    console.log("✅ Verified user payload:", user); // ⬅️ OVDE
    req.user = user;
    next();
  });
}


module.exports = authenticateToken;
