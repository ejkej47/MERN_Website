const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Korisnik već postoji!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Registrovanje uspešno!" });
  } catch (err) {
    res.status(500).json({ message: "Greška na serveru." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Pogrešan email ili lozinka." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Pogrešan email ili lozinka." });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
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
    res.status(500).json({ message: "Greška na serveru." });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(204).json({ message: "Već ste odjavljeni." });

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);

    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    });

    res.status(200).json({ message: "Uspešno ste se odjavili." });
  } catch {
    res.clearCookie("refreshToken");
    res.status(204).json({ message: "Već ste odjavljeni." });
  }
};

exports.refreshToken = async (req, res) => {
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
  } catch {
    res.status(403).json({ message: "Nevažeći refresh token." });
  }
};

exports.protectedRoute = (req, res) => {
  res.json({ message: `Zdravo ${req.user.email}, uspešno si pristupio.` });
};
