const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: "" },
  image: {type: String},
  refreshToken:{type: String, default:""}
});

// Ako model već postoji, koristi ga, ako ne, definiši novi
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
