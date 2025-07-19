const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");


// === Dohvati sve kurseve ===
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Greška pri učitavanju kurseva." });
  }
});

// === Kupovina kursa ===
router.post("/purchase/:courseId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const courseId = req.params.courseId;

    if (!user.purchasedCourses.includes(courseId)) {
      user.purchasedCourses.push(courseId);
      await user.save();
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
    const user = await User.findById(req.user.userId).populate("purchasedCourses");
    res.json({ courses: user.purchasedCourses });
  } catch (err) {
    res.status(500).json({ message: "Greška prilikom učitavanja kurseva." });
  }
});

// === Dohvati besplatne kurseve koje korisnik još nema ===
router.get("/free", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("purchasedCourses");
    const purchasedIds = user.purchasedCourses.map(course => course._id.toString());

    const freeCourses = await Course.find({ price: 0 });
    const availableCourses = freeCourses.filter(course => !purchasedIds.includes(course._id.toString()));

    res.json({ courses: availableCourses });
  } catch (err) {
    console.error("Greška pri dohvatu besplatnih kurseva:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

module.exports = router;
