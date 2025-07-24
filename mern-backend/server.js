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


// CORS konfiguracija
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-website-nine.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));



// Ručno dodavanje CORS headera (opciono ali korisno)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});


// Middleware za parsiranje i cookies
app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";


// Session za Passport Google login
app.use(session({
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  }
}));





// Debug cookies
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});


app.use(helmet());




const csrfProtection = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", // "none" za Vercel, "lax" za lokalno
    secure: isProduction // true za HTTPS (Render), false za lokalni HTTP
  }
});


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
