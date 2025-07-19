const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");


// Middleware
app.use(cors({
  origin: "http://localhost:3000", // frontend domen
  credentials: true                // dozvoli cookies (npr. refresh token kao HTTP-only cookie)
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});


// MongoDB konekcija
mongoose.connect("mongodb+srv://aleksandarkatic47:mongoDB47.@tickalex.rr8ngec.mongodb.net/?retryWrites=true&w=majority&appName=Tickalex", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

// Rute
app.use('/api', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
