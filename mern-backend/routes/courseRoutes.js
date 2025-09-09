const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

// === Dohvati sve kurseve sa brojem uvodnih lekcija ===
router.get("/courses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*, 
        COUNT(l.id) AS "lessonCount"
      FROM "Course" c
      LEFT JOIN "Lesson" l ON l.course_id = c.id AND l.module_id IS NULL
      GROUP BY c.id
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Greška pri učitavanju kurseva:", err);
    res.status(500).json({ message: "Greška pri učitavanju kurseva." });
  }
});

// === Dohvati kurs po slug-u + da li korisnik ima pristup bar jednom modulu ===
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

    if (req.user?.id) {
      const accessCheck = await pool.query(`
        SELECT 1 FROM "UserModuleAccess" uma
        JOIN "Module" m ON uma.module_id = m.id
        WHERE uma.user_id = $1 AND m.course_id = $2
        LIMIT 1
      `, [req.user.id, course.id]);

      isPurchased = accessCheck.rowCount > 0;
    }

    res.json({ ...course, isPurchased });
  } catch (err) {
    console.error("Greška pri dohvatu kursa po slug-u:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// === Kupovina kursa → dodeljuje pristup svim njegovim modulima ===
router.post("/purchase/:courseId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = parseInt(req.params.courseId);

    const { rows } = await pool.query('SELECT * FROM "Course" WHERE id = $1', [courseId]);
    const course = rows[0];
    if (!course) return res.status(404).json({ message: "Kurs ne postoji." });

    if (course.price > 0) {
      return res.status(403).json({ message: "Kurs nije besplatan. Plaćanje nije omogućeno." });
    }

    const modules = await pool.query(
      'SELECT id FROM "Module" WHERE course_id = $1',
      [courseId]
    );

    for (const module of modules.rows) {
      await pool.query(
        `INSERT INTO "UserModuleAccess" ("user_id", "module_id")
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userId, module.id]
      );
    }

    res.json({ message: "Kurs dodat! Pristup svim modulima je omogućen." });
  } catch (err) {
    console.error("Greška pri kupovini:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Dohvati sve kurseve na osnovu pristupa modulima ===
router.get("/my-courses", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT DISTINCT c.*
      FROM "Course" c
      JOIN "Module" m ON m.course_id = c.id
      JOIN "UserModuleAccess" uma ON uma.module_id = m.id
      WHERE uma.user_id = $1
    `, [userId]);

    res.json({ courses: result.rows });
  } catch (err) {
    console.error("❌ Greška u /my-courses:", err);
    res.status(500).json({ message: "Greška pri učitavanju." });
  }
});

// === Full kurs: detalji + uvodne lekcije + moduli sa lekcijama ===
router.get("/courses/:courseId/full-content", optionalAuth, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const userId = req.user?.id || 0;

    // 1. Dohvati kurs
    const courseRes = await pool.query(
      'SELECT * FROM "Course" WHERE id = $1',
      [courseId]
    );
    if (courseRes.rowCount === 0) {
      return res.status(404).json({ message: "Kurs ne postoji." });
    }
    const course = courseRes.rows[0];

    // 2. Dohvati pristup korisnika modulima
    let accessibleModuleIds = [];
    if (userId) {
      const accessModulesRes = await pool.query(
        `SELECT module_id FROM "UserModuleAccess" WHERE user_id = $1`,
        [userId]
      );
      accessibleModuleIds = accessModulesRes.rows.map(r => r.module_id);
    }

    // 3. Uvodne lekcije (bez modula)
    const courseLessonsRes = await pool.query(`
      SELECT * FROM "Lesson"
      WHERE course_id = $1 AND module_id IS NULL
      ORDER BY "order"
    `, [courseId]);

    const courseLessons = courseLessonsRes.rows.map(l => ({
      ...l,
      isLocked: !l.is_free
    }));

    // 4. Dohvati module i lekcije
    const modulesRes = await pool.query(`
      SELECT * FROM "Module"
      WHERE course_id = $1
      ORDER BY "order"
    `, [courseId]);

    const modules = [];
    for (const mod of modulesRes.rows) {
      const lessonsRes = await pool.query(`
        SELECT * FROM "Lesson"
        WHERE module_id = $1
        ORDER BY "order"
      `, [mod.id]);

      const lessons = lessonsRes.rows.map(l => ({
        ...l,
        isLocked: !l.is_free && !accessibleModuleIds.includes(mod.id)
      }));

      modules.push({ ...mod, lessons });
    }

    res.json({
      course,
      courseLessons,
      modules
    });
  } catch (err) {
    console.error("❌ Greška u /courses/:courseId/full-content:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Full kurs po slug-u: detalji + uvodne lekcije + moduli sa lekcijama ===
// === Full kurs po slug-u: detalji + uvodne lekcije + moduli sa lekcijama ===
router.get("/courses/slug/:slug/full-content", optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id || 0;

    // 1. Dohvati kurs po slugu
    const courseRes = await pool.query(
      `SELECT * FROM "Course" WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (courseRes.rowCount === 0) {
      return res.status(404).json({ message: "Kurs nije pronađen." });
    }

    const course = courseRes.rows[0];

    // 2. Pristup korisnika modulima
    let accessibleModuleIds = [];
    if (userId) {
      const accessRes = await pool.query(
        `SELECT module_id FROM "UserModuleAccess" WHERE user_id = $1`,
        [userId]
      );
      accessibleModuleIds = accessRes.rows.map(r => r.module_id);
    }

    // 3. Uvodne lekcije (bez modula)
    const lessonsRes = await pool.query(
      `SELECT * FROM "Lesson"
       WHERE course_id = $1 AND module_id IS NULL
       ORDER BY "order"`,
      [course.id]
    );

    const courseLessons = lessonsRes.rows.map(l => ({
      ...l,
      isLocked: !l.is_free
    }));

    // 4. Moduli i njihove lekcije
    const modulesRes = await pool.query(
      `SELECT * FROM "Module"
       WHERE course_id = $1
       ORDER BY "order"`,
      [course.id]
    );

    const modules = [];
    for (const mod of modulesRes.rows) {
      const modLessonsRes = await pool.query(
        `SELECT * FROM "Lesson"
         WHERE module_id = $1
         ORDER BY "order"`,
        [mod.id]
      );

      const lessons = modLessonsRes.rows.map(l => ({
        ...l,
        isLocked: !l.is_free && !accessibleModuleIds.includes(mod.id)
      }));

      modules.push({ ...mod, lessons });
    }

    // 5. Response
    res.json({
      course,
      courseLessons,
      modules,
    });
  } catch (err) {
    console.error("❌ Greška u /courses/slug/:slug/full-content:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});



module.exports = router;
