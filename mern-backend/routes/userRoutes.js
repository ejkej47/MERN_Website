const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

// Autentifikovani korisnici
router.put("/change-email", authenticateToken, userController.changeEmail);
router.put("/change-password", authenticateToken, userController.changePassword);

// Reset lozinke (anonimno)
router.post("/send-reset-code", userController.requestReset);
router.post("/verify-reset-code", userController.verifyResetCode);

module.exports = router;
