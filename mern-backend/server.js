const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const xss = require("xss");
const sanitize = require("mongo-sanitize");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Body parser i cookies
app.use(express.json());
app.use(cookieParser());

// CORS sa cookie podrškom
app.use(cors({
  origin: "http://localhost:3000", // frontend domen
  credentials: true                // dozvoli cookie kao što je refreshToken
}));

const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/auth");
// Rute
app.use("/api", authRoutes);
app.use("/api", courseRoutes);








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

// CSRF zaštita (globalna)
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// CSRF token endpoint
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// HPP zaštita
app.use(hpp());

// Sanitize: Mongo + XSS
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);

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



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Povezano na MongoDB"))
.catch(err => console.error("Greška pri povezivanju na MongoDB:", err));
// Pokretanje servera
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
