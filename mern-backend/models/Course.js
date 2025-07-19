const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["text", "video", "quiz"], required: true },
  content: {
    type: mongoose.Schema.Types.Mixed, // sadržaj zavisi od tipa
    required: true
  }
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  sections: [SectionSchema], // niz delova kursa
});

module.exports = mongoose.model("Course", CourseSchema);
