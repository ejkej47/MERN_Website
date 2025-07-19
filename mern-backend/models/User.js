const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: "" },
  image: { type: String },
  refreshToken: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

// Ako model već postoji, koristi ga, ako ne, definiši novi
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
