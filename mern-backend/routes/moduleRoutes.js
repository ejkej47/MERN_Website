const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

// === 1. Dohvati sve module (admin ili public prikaz) ===
router.get("/modules", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "Module" ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    console.error("Greška pri dohvatanju modula:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === 2. Dohvati modul po slug-u + kurs info ===
router.get("/modules/slug/:slug", optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id || 0;

    const modRes = await pool.query(
      `SELECT m.*, c.slug AS course_slug, c.title AS course_title
       FROM "Module" m
       LEFT JOIN "Course" c ON m.course_id = c.id
       WHERE m.slug = $1
       LIMIT 1`,
      [slug]
    );

    if (modRes.rowCount === 0) {
      return res.status(404).json({ message: "Modul ne postoji." });
    }

    const module = modRes.rows[0];

    // Provera pristupa
    const accessRes = await pool.query(
      `SELECT 1 FROM "UserModuleAccess"
       WHERE user_id = $1 AND module_id = $2`,
      [userId, module.id]
    );
    const isAccessible = accessRes.rowCount > 0;

    // Lekcije
    const lessonsRes = await pool.query(
      `SELECT * FROM "Lesson"
       WHERE module_id = $1
       ORDER BY "order"`,
      [module.id]
    );

    const lessons = lessonsRes.rows.map((l) => ({
      ...l,
      isLocked: !l.is_free && !isAccessible,
    }));

    res.json({
      module: {
        ...module,
        isAccessible,
      },
      lessons,
    });
  } catch (err) {
    console.error("Greška pri dohvatu modula:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === 3. Dohvati sve lekcije iz modula po slug-u ===
router.get("/modules/slug/:slug/lessons", async (req, res) => {
  try {
    const { slug } = req.params;

    const modRes = await pool.query(
      `SELECT id FROM "Module" WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    if (modRes.rowCount === 0) {
      return res.status(404).json({ message: "Modul ne postoji." });
    }

    const moduleId = modRes.rows[0].id;

    const lessons = await pool.query(
      `SELECT * FROM "Lesson"
       WHERE module_id = $1
       ORDER BY "order"`,
      [moduleId]
    );

    res.json({ lessons: lessons.rows });
  } catch (err) {
    console.error("Greška pri dohvatanju lekcija za modul:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === 4. Dohvati jednu lekciju po slug-u i lessonId ===
router.get("/modules/slug/:slug/lessons/:lessonId", optionalAuth, async (req, res) => {
  try {
    const { slug, lessonId } = req.params;
    const userId = req.user?.id || 0;

    const modRes = await pool.query(
      `SELECT id FROM "Module" WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    if (modRes.rowCount === 0) {
      return res.status(404).json({ message: "Modul ne postoji." });
    }
    const moduleId = modRes.rows[0].id;

    const lessonRes = await pool.query(
      `SELECT * FROM "Lesson" WHERE module_id = $1 AND id = $2 LIMIT 1`,
      [moduleId, lessonId]
    );
    if (lessonRes.rowCount === 0) {
      return res.status(404).json({ message: "Lekcija ne postoji." });
    }

    // Provera pristupa
    const accessRes = await pool.query(
      `SELECT 1 FROM "UserModuleAccess"
       WHERE user_id = $1 AND module_id = $2`,
      [userId, moduleId]
    );
    const isAccessible = accessRes.rowCount > 0;

    const lesson = lessonRes.rows[0];
    lesson.isLocked = !lesson.is_free && !isAccessible;

    res.json({ lesson });
  } catch (err) {
    console.error("Greška pri dohvatanju lekcije:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === 5. Kupovina modula po slug-u (ako je besplatan) ===
router.post("/purchase-module/:slug", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { slug } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM "Module" WHERE slug = $1 LIMIT 1',
      [slug]
    );
    const module = rows[0];
    if (!module) return res.status(404).json({ message: "Modul ne postoji." });

    if (module.price > 0) {
      return res
        .status(403)
        .json({ message: "Modul nije besplatan. Plaćanje nije omogućeno." });
    }

    await pool.query(
      `INSERT INTO "UserModuleAccess" ("user_id", "module_id")
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, module.id]
    );

    res.json({ message: "Modul dodat! Pristup je omogućen." });
  } catch (err) {
    console.error("Greška pri kupovini modula:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;
