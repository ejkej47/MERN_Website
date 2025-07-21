const { generateAccessToken, generateRefreshToken } = require("../utils/token");

exports.googleLogin = require("passport").authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = [
  require("passport").authenticate("google", { session: false }),
  async (req, res) => {
    const token = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    req.user.refreshToken = refreshToken;
    await req.user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:3000/courses?token=${token}&email=${req.user.email}&image=${req.user.image || ""}`);
  }
];
