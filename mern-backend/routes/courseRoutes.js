const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authenticateToken = require("../middleware/authMiddleware");

// === Dohvati sve kurseve ===
router.get("/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Greška pri učitavanju kurseva." });
  }
});

// === Kupovina kursa ===
router.post("/purchase/:courseId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = parseInt(req.params.courseId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { courses: true },
    });

    const alreadyPurchased = user.courses.some(c => c.id === courseId);

    if (!alreadyPurchased) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          courses: {
            connect: { id: courseId },
          },
        },
      });
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
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { courses: true },
    });

    res.json({ courses: user.courses });
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom učitavanja kurseva." });
  }
});

// === Dohvati besplatne kurseve koje korisnik još nema ===
router.get("/free", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { courses: true },
    });

    const purchasedIds = user.courses.map(course => course.id);

    const freeCourses = await prisma.course.findMany({
      where: { price: 0 },
    });

    const availableCourses = freeCourses.filter(
      course => !purchasedIds.includes(course.id)
    );

    res.json({ courses: availableCourses });
  } catch (err) {
    console.error("Greška pri dohvatu besplatnih kurseva:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;
