const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// === Snimi rezultat kviza ===
router.post("/quiz-results", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizKey, flight, attack, manipulation, harmonious } = req.body;

    if (!quizKey || typeof quizKey !== "string") {
      return res.status(400).json({ error: "quizKey je obavezan i mora biti string." });
    }

    if (
      typeof flight !== "number" ||
      typeof attack !== "number" ||
      typeof manipulation !== "number" ||
      typeof harmonious !== "number"
    ) {
      return res.status(400).json({ error: "Rezultati kviza moraju biti brojevi." });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO "UserQuizResult" 
        ("user_id", "quiz_key", "flight", "attack", "manipulation", "harmonious")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, quiz_key, flight, attack, manipulation, harmonious, created_at
      `,
      [userId, quizKey, flight, attack, manipulation, harmonious]
    );

    res.status(201).json({
      message: "Rezultat uspešno sačuvan.",
      result: rows[0],
    });
  } catch (err) {
    console.error("❌ Greška pri snimanju kviz rezultata:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// === Poslednji rezultat korisnika za dati kviz ===
router.get("/quiz-results/:quizKey/latest", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizKey } = req.params;

    const { rows } = await pool.query(
      `
      SELECT id, quiz_key, flight, attack, manipulation, harmonious, created_at
      FROM "UserQuizResult"
      WHERE user_id = $1 AND quiz_key = $2
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId, quizKey]
    );

    if (rows.length === 0) {
      return res.json({ message: "Nema rezultata za ovaj kviz." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Greška pri dohvaćanju kviz rezultata:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// === Istorija rezultata korisnika za dati kviz ===
router.get("/quiz-results/:quizKey/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizKey } = req.params;

    const { rows } = await pool.query(
      `
      SELECT id, quiz_key, flight, attack, manipulation, harmonious, created_at
      FROM "UserQuizResult"
      WHERE user_id = $1 AND quiz_key = $2
      ORDER BY created_at DESC
      `,
      [userId, quizKey]
    );

    if (rows.length === 0) {
      return res.json({ message: "Nema istorije rezultata za ovaj kviz." });
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ Greška pri dohvaćanju istorije kviz rezultata:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

module.exports = router;
