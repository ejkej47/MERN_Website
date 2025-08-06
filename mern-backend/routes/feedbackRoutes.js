const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// === Dodaj feedback ===
router.post("/site-feedback", authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: "Ocena mora biti između 1 i 5." });

  try {
    await pool.query(
      `INSERT INTO "SiteFeedback" ("userid", rating, comment)
       VALUES ($1, $2, $3)`,
      [userId, rating, comment]
    );

    res.status(201).json({ message: "Hvala na oceni!" });
  } catch (err) {
    console.error("Greška pri dodavanju feedbacka:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

router.get("/site-feedback", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sf.id,
        sf.rating,
        sf.comment,
        sf.created_at,
        u.email,
        u.image
      FROM "SiteFeedback" sf
      JOIN "User" u ON u.id = sf."userid"
      ORDER BY sf.created_at DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Greška pri učitavanju feedbacka:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;
