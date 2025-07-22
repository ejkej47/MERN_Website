const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

// Access token važi 15 minuta
function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,         // PostgreSQL koristi "id", a ne "_id"
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
}

// Refresh token važi 7 dana
function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
