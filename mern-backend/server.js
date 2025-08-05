const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss");
const passport = require("passport");
require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env"
});

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-website-nine.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: false // ⛔ nema cookies
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "");
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(hpp());

// ✅ XSS zaštita
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// ✅ Auth i rute
require("./config/passport");
app.use(passport.initialize());

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courseRoutes");
const authenticateToken = require("./middleware/authMiddleware");

app.use("/", authRoutes);
app.use("/", courseRoutes);

app.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack || err);
  res.status(500).send("Internal server error.");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
