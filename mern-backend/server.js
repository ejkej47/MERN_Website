// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const xss = require("xss");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware za parsiranje i cookies
app.use(express.json());
app.use(cookieParser());

// Session za Passport Google login
app.use(session({
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // mora biti true za HTTPS na Renderu
    sameSite: "none" // dozvoljava cross-origin cookies (između Vercel i Render)
  }

}));

// CORS konfiguracija

app.use(cors({
  origin: [
    "http://localhost:5173", // dodaj ovo ako testiraš lokalni frontend
    "https://mern-website-nine.vercel.app", // i ovo za deploy
  ],
  credentials: true
}));



// Debug cookies
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// Helmet zaštita
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://apis.google.com"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    fontSrc: ["'self'", "https:", "data:"],
    formAction: ["'self'"],
    frameAncestors: ["'self'"],
    imgSrc: ["'self'", "data:"],
    scriptSrcAttr: ["'none'"],
    styleSrc: ["'self'", "https:", "'unsafe-inline'"],
    upgradeInsecureRequests: [],
  },
}));

// CSRF zaštita
const csrfProtection = csrf({ cookie: true });

// ✅ Ruta za CSRF token — mora biti pre zaštite
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Globalni CSRF middleware, s izuzecima
app.use((req, res, next) => {
  if (
    req.path.startsWith("/api/auth/google") ||
    req.path === "/api/auth/google/callback" ||
    req.path === "/api/csrf-token"
  ) {
    return next(); // preskoči CSRF za Google i token rutu
  }

  return csrfProtection(req, res, next);
});

// HPP zaštita (http parameter pollution)
app.use(hpp());

// XSS čišćenje inputa
app.use((req, res, next) => {
  if (req.body) {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  if (req.params) {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  next();
});

// Passport
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

// Rute
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courseRoutes");
app.use("/api", authRoutes);
app.use("/api", courseRoutes);

// Globalni error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack || err);
  res.status(500).send("Internal server error.");
});

// Pokretanje servera
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
