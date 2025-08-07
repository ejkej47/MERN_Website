const { generateAccessToken } = require("../utils/token");

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
