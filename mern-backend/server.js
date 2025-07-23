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

// Body parser i cookies
app.use(express.json());
app.use(cookieParser());

// Express-session fallback (obavezno zbog Passport OAuth logike)
app.use(session({
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // za localhost
}));

// CORS sa cookie podrškom
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Debug cookies u konzoli
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

// CSRF zaštita, osim za Google OAuth rute
const csrfProtection = csrf({ cookie: true });
app.use((req, res, next) => {
  if (
    req.path.startsWith("/api/auth/google") ||
    req.path === "/api/auth/google/callback"
  ) {
    return next(); // preskoči CSRF za Google OAuth tok
  }

  return csrfProtection(req, res, next);
});

// CSRF token endpoint
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// HPP zaštita
app.use(hpp());

// Sanitize XSS input
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

// Passport konfiguracija
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

// PostgreSQL rute
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);
app.use("/api", courseRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack || err);
  res.status(500).send("Internal server error.");
});


// Pokretanje servera
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
