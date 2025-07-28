const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const xss = require("xss");
const session = require("express-session");
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

// ✅ Parsiranje tela & cookies (obavezno pre CSRF)
app.use(express.json());
app.use(cookieParser());

// ✅ Session (opciono, koristi se ako radiš sa express-session)
app.use(session({
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  }
}));

// ✅ CSRF zaštita
const csrfProtection = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
  }
});

// ✅ Ruta za dohvat CSRF tokena (klijent prvo ovo zove)
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.cookie("_csrf", req.csrfToken(), {
    httpOnly: false,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
  });
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Primeni CSRF zaštitu pre ruta (osim za izuzetke)
if (isProduction) {
  const skip = [
    "/login", "/register", "/logout",
    "/refresh-token", "/csrf-token",
    "/auth/google", "/auth/google/callback"
  ];
  app.use((req, res, next) => {
    if (skip.includes(req.path)) return next();
    return csrfProtection(req, res, next);
  });
}

// ✅ Security middlewares
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

// ✅ Debug cookies (privremeno)
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// ✅ Auth i Passport
require("./config/passport");
app.use(passport.initialize());

// ✅ Rute (nakon CSRF)
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
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  console.error("Global error handler:", err.stack || err);
  res.status(500).send("Internal server error.");
});

// ✅ Pokreni server
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
