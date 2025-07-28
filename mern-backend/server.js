const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const xss = require("xss");
const session = require("express-session");

// ✅ Postavi NODE_ENV ručno za lokalni rad
process.env.NODE_ENV = "development";

// ✅ Učitaj ispravan .env fajl
require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env"
});

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-website-nine.vercel.app"
];

// 🛡️ CORS sa logom
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌍 CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Ručno postavi CORS headere i handle OPTIONS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Parsiranje & kolačići
app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";

// 🧠 Session (opciono, koristiš samo ako ti treba)
app.use(session({
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  }
}));

// ✅ CSRF zaštita — definiši pre ruta
const csrfProtection = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
  }
});

// ✅ Ruta za dobijanje CSRF tokena (pre globalnog middleware-a)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.cookie("_csrf", req.csrfToken(), {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Primeni CSRF zaštitu globalno, osim na određene rute
if(isProduction){
  app.use((req, res, next) => {
  const skipCsrf = [
    "/api/login",
    "/api/register",
    "/api/logout",
    "/api/refresh-token",
    "/api/csrf-token",
    "/api/auth/google",
    "/api/auth/google/callback",
  ];

  if (skipCsrf.includes(req.originalUrl)) {
    return next();
  }

  return csrfProtection(req, res, next);
});
}

// Debug cookies
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// Helmet & sigurnost
app.use(helmet());
app.use(hpp());
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

// 🔐 Passport auth
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

// 📦 Rute
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courseRoutes");
app.use("/api", authRoutes);
app.use("/api", courseRoutes);

// ✅ Ruta za proveru korisnika
const authenticateToken = require("./middleware/authMiddleware");
app.get("/api/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ❗ Global error handler
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.warn("🛡️ CSRF greška:", err.message);
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  console.error("Global error handler:", err.stack || err);
  res.status(500).send("Internal server error.");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
