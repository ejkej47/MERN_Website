const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Pravilno montiraj rute
app.use("/api", authRoutes);

// Konekcija na MongoDB
mongoose.connect("mongodb+srv://aleksandarkatic47:mongoDB47.@tickalex.rr8ngec.mongodb.net/?retryWrites=true&w=majority&appName=Tickalex")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Pokreni server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
