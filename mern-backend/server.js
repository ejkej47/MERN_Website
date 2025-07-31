const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const xss = require("xss");
const passport = require("passport");
require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env"
});

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// ✅ Dozvoljeni frontend origin-i
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-website-nine.vercel.app"
];

// ✅ CORS konfiguracija
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Ručni CORS header-i za dodatnu sigurnost
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Parsiranje cookies i tela — redosled je bitan!
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CSRF zaštita (JSON token za cross-origin setup)
const csrfProtection = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: false, // ✅ za frontend pristup tokenu
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/"
  }
});

// ✅ Ruta za dohvat CSRF tokena (frontend koristi JSON, ne cookie)
app.get("/csrf-token", csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("_csrf", csrfToken, {
    httpOnly: false, // ✅ omogućava čitanje iz JS ako ikad bude trebalo
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/"
  });
  res.json({ csrfToken });
});

// ✅ CSRF zaštita aktivna za sve osim skip ruta
const skip = [
  "/login", "/register", "/logout",
  "/refresh-token", "/csrf-token",
  "/auth/google", "/auth/google/callback"
];

app.use((req, res, next) => {
  console.log("🔍 [CSRF] Request path:", req.path);
  console.log("🔍 [CSRF] Incoming token (header):", req.headers["x-csrf-token"]);
  console.log("🔍 [CSRF] Cookie token (_csrf):", req.cookies._csrf);

  if (skip.includes(req.path)) return next();

  return csrfProtection(req, res, next);
});

// ✅ Sigurnosni middlewares
app.use(helmet());
app.use(hpp());

// ✅ XSS zaštita za telo i parametre
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  next();
});

// ✅ Debug cookies (privremeno, možeš kasnije ukloniti)
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// ✅ Auth i Passport
require("./config/passport");
app.use(passport.initialize());

// ✅ Rute (nakon CSRF zaštite)
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courseRoutes");
const authenticateToken = require("./middleware/authMiddleware");

app.use("/", authRoutes);
app.use("/", courseRoutes);

// ✅ Ruta za proveru korisnika
app.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.warn("🛡️ CSRF greška:", err.message);
    console.warn("📨 Header token:", req.headers["x-csrf-token"]);
    console.warn("📦 Cookie token:", req.cookies._csrf);
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  console.error("Global error handler:", err.stack || err);
  res.status(500).send("Internal server error.");
});

// ✅ Pokreni server
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
