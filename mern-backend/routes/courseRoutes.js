const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

// === Dohvati sve kurseve ===
router.get("/courses", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Course" ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error("Greška pri učitavanju kurseva:", err);
    res.status(500).json({ message: "Greška pri učitavanju kurseva." });
  }
});

// === Dohvati kurs po slug-u ===
router.get("/courses/slug/:slug", optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM "Course" WHERE slug = $1 LIMIT 1',
      [slug]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Kurs nije pronađen" });

    const course = result.rows[0];
    let isPurchased = false;

    // ✅ Ako je korisnik logovan, proveri pristup
    if (req.user?.id) {
      const accessCheck = await pool.query(
        'SELECT 1 FROM "UserCourseAccess" WHERE "userId" = $1 AND "courseId" = $2',
        [req.user.id, course.id]
      );
      isPurchased = accessCheck.rowCount > 0;
    }

    res.json({ ...course, isPurchased });
  } catch (err) {
    console.error("Greška pri dohvatu kursa po slug-u:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// === Kupovina kursa (samo za besplatne trenutno) ===
router.post("/purchase/:courseId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = parseInt(req.params.courseId);

    const [course] = (
      await pool.query('SELECT * FROM "Course" WHERE id = $1', [courseId])
    ).rows;

    if (!course) return res.status(404).json({ message: "Kurs ne postoji." });

    const alreadyBought = await pool.query(
      'SELECT 1 FROM "UserCourseAccess" WHERE "userId" = $1 AND "courseId" = $2',
      [userId, courseId]
    );

    if (alreadyBought.rowCount > 0) {
      return res.status(200).json({ message: "Kurs je već dodat." });
    }

    // Ako je kurs besplatan, automatski dozvoli
    if (course.price === 0) {
      await pool.query(
        'INSERT INTO "UserCourseAccess" ("userId", "courseId") VALUES ($1, $2)',
        [userId, courseId]
      );
      return res.status(200).json({ message: "Besplatan kurs dodat!" });
    }

    return res.status(403).json({
      message: `Kurs nije besplatan. Kurs ima cenu ${course.price} (Plaćanje još nije implementirano.)`,
    });
  } catch (err) {
    console.error("Greška pri kupovini:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Dohvati kupljene kurseve korisnika ===
router.get("/my-courses", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      console.warn("❌ userId nije definisan");
      return res.status(400).json({ message: "Nevalidan korisnički ID." });
    }

    const query = `
      SELECT c.* FROM "Course" c
      JOIN "UserCourseAccess" uca ON uca."courseId" = c.id
      WHERE uca."userId" = $1
    `;

    const result = await pool.query(query, [userId]);

    res.json({ courses: result.rows });
  } catch (err) {
    console.error("❌ Greška u /my-courses:", err.stack || err.message || err);
    res.status(500).json({ message: "Greška prilikom učitavanja kurseva." });
  }
});

// === Dohvati lekcije za kurs (sa isLocked) ===
router.get("/courses/:courseId/lessons", authenticateToken, async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const userId = req.user?.id || null;

  try {
    const lessonsRes = await pool.query(
      `SELECT id, title, content, is_free, "order" FROM "Lesson" WHERE course_id = $1 ORDER BY "order" ASC`,
      [courseId]
    );

    const lessons = lessonsRes.rows;

    const access = await pool.query(
      `SELECT 1 FROM "UserCourseAccess" WHERE "userId" = $1 AND "courseId" = $2`,
      [userId, courseId]
    );

    const hasAccess = access.rowCount > 0;

    const final = lessons.map((l) => ({
      ...l,
      isLocked: !l.is_free && !hasAccess,
    }));

    res.json({ lessons: final });
  } catch (err) {
    console.error("Greška pri dohvaćanju lekcija:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Public verzija lekcija (bez login-a, bez contenta) ===
router.get("/courses/:courseId/public-lessons", async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  try {
    const lessonsRes = await pool.query(
      `SELECT id, title, is_free, "order" FROM "Lesson" WHERE course_id = $1 ORDER BY "order" ASC`,
      [courseId]
    );

    const lessons = lessonsRes.rows.map((l) => ({
      ...l,
      isLocked: !l.is_free,
    }));

    res.json({ lessons });
  } catch (err) {
    console.error("Greška pri dohvaćanju public lekcija:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;
