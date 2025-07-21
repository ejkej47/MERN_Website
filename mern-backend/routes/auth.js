const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/passport");

const authController = require("../controllers/authController");
const googleController = require("../controllers/googleController");
const passwordResetController = require("../controllers/passwordResetController");
const authenticateToken = require("../middleware/authMiddleware");

// REGISTER & LOGIN
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

// PROTECTED
router.get("/protected", authenticateToken, authController.protectedRoute);

// GOOGLE
router.get("/auth/google", googleController.googleLogin);
router.get("/auth/google/callback", googleController.googleCallback);

// RESET LOZINKE
router.post("/send-reset-code", passwordResetController.sendResetCode);
router.post("/verify-reset-code", passwordResetController.verifyResetCode);
router.post("/reset-password", passwordResetController.resetPassword);

module.exports = router;
