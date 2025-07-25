// backend/routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// === Dohvati sve kurseve ===
router.get("/courses", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Course" ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error("Greška pri učitavanju kurseva:", err.stack || err.message || err);
    res.status(500).json({ message: "Greška pri učitavanju kurseva." });
  }
});


// === Kupovina kursa ===
router.post("/purchase/:courseId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = parseInt(req.params.courseId);

    const result = await pool.query(
      "SELECT * FROM \"UserCourseAccess\" WHERE \"userId\" = $1 AND \"courseId\" = $2",
      [userId, courseId]
    );

    if (result.rowCount === 0) {
      await pool.query(
        "INSERT INTO \"UserCourseAccess\" (\"userId\", \"courseId\") VALUES ($1, $2)",
        [userId, courseId]
      );
      return res.status(200).json({ message: "Kurs uspešno dodat." });
    } else {
      return res.status(200).json({ message: "Kurs je već kupljen." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška prilikom dodavanja kursa." });
  }
});

// === Dohvati kupljene kurseve korisnika ===
router.get("/my-courses", authenticateToken, async (req, res) => {
  try {
    console.log("🟡 req.user:", req.user);
    const userId = req.user.userId;
    const result = await pool.query(
      `SELECT c.* FROM "Course" c
       JOIN "UserCourseAccess" uca ON uca."courseId" = c.id
       WHERE uca."userId" = $1`,
      [userId]
    );
    res.json({ courses: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom učitavanja kurseva." });
  }
});

// === Dohvati besplatne kurseve koje korisnik još nema ===
router.get("/free", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      `SELECT * FROM "Course" WHERE price = 0 AND id NOT IN (
        SELECT "courseId" FROM "UserCourseAccess" WHERE "userId" = $1
      )`,
      [userId]
    );
    res.json({ courses: result.rows });
  } catch (err) {
    console.error("Greška pri dohvatu besplatnih kurseva:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// === Dohvati kurs po SLUG ===
router.get("/courses/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      "SELECT * FROM \"Course\" WHERE slug = $1 LIMIT 1",
      [slug]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Kurs nije pronađen" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Greška pri čitanju kursa po slug-u:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// === Kreiraj dummy kurs ===
router.post("/courses/dummy", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO "Course" (title, description, slug, "imageUrl", price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        "React Full Course",
        "Kompletan vodič za React sa primerima",
        "react-full-course",
        "https://via.placeholder.com/560x315.png?text=React+Course",
        49
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri kreiranju kursa" });
  }
});

module.exports = router;
