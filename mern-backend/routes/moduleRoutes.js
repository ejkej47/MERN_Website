const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// === 1. Dohvati sve module (admin ili public prikaz) ===
router.get("/modules", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "Module" ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    console.error("Greška pri dohvaćanju modula:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});
const optionalAuth = require("../middleware/optionalAuth"); // ako već nemaš

router.get("/modules/:id", optionalAuth, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const userId = req.user?.id || 0;

    const modRes = await pool.query('SELECT * FROM "Module" WHERE id = $1', [moduleId]);
    if (modRes.rowCount === 0) return res.status(404).json({ message: "Modul ne postoji." });

    const module = modRes.rows[0];

    const accessRes = await pool.query(`
      SELECT 1 FROM "UserModuleAccess"
      WHERE user_id = $1 AND module_id = $2
    `, [userId, moduleId]);

    const isAccessible = accessRes.rowCount > 0;

    const lessonsRes = await pool.query(`
      SELECT * FROM "Lesson"
      WHERE module_id = $1
      ORDER BY "order"
    `, [moduleId]);

    const lessons = lessonsRes.rows.map(l => ({
      ...l,
      isLocked: !l.is_free && !isAccessible
    }));

    res.json({
      module: {
        ...module,
        isAccessible
      },
      lessons
    });
  } catch (err) {
    console.error("Greška pri dohvatu modula:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === 2. Dohvati lekcije iz jednog modula ===
router.get("/modules/:id/lessons", async (req, res) => {
  const moduleId = parseInt(req.params.id);
  try {
    const lessons = await pool.query(`
      SELECT * FROM "Lesson"
      WHERE module_id = $1
      ORDER BY "order"
    `, [moduleId]);

    res.json({ lessons: lessons.rows });
  } catch (err) {
    console.error("Greška pri dohvaćanju lekcija za modul:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === 3. Kupovina pojedinačnog modula (besplatnog) ===
router.post("/purchase-module/:moduleId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const moduleId = parseInt(req.params.moduleId);

    // Proveri da li modul postoji
    const { rows } = await pool.query(
      'SELECT * FROM "Module" WHERE id = $1',
      [moduleId]
    );
    const module = rows[0];
    if (!module) return res.status(404).json({ message: "Modul ne postoji." });

    if (module.price > 0) {
      return res.status(403).json({ message: "Modul nije besplatan." });
    }

    await pool.query(`
      INSERT INTO "UserModuleAccess" ("user_id", "module_id")
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [userId, moduleId]);

    res.json({ message: "Modul dodat! Pristup je omogućen." });
  } catch (err) {
    console.error("Greška pri kupovini modula:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;
