const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// === Snimi rezultat kviza ===
router.post("/quiz-results", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizKey, flight, attack, manipulation, harmonious } = req.body;

    if (
      typeof flight !== "number" ||
      typeof attack !== "number" ||
      typeof manipulation !== "number" ||
      typeof harmonious !== "number"
    ) {
      return res.status(400).json({ error: "Podaci nisu validni." });
    }

    const result = await pool.query(`
      INSERT INTO "UserQuizResult"(user_id, quiz_key, flight, attack, manipulation, harmonious)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, quiz_key, flight, attack, manipulation, harmonious, created_at
    `, [userId, quizKey, flight, attack, manipulation, harmonious]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Greška pri snimanju kviz rezultata:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// === Poslednji rezultat korisnika za dati kviz ===
router.get("/quiz-results/:quizKey/latest", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizKey } = req.params;

    const result = await pool.query(`
      SELECT id, quiz_key, flight, attack, manipulation, harmonious, created_at
      FROM "UserQuizResult"
      WHERE user_id = $1 AND quiz_key = $2
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId, quizKey]);

    res.json(result.rows[0] || null);
  } catch (err) {
    console.error("Greška pri dohvaćanju kviz rezultata:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

module.exports = router;
