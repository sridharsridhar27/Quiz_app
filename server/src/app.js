const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const playerQuizRoutes = require("./routes/playerQuizRoutes");
const adminQuizRoutes = require("./routes/adminQuizRoutes");


const app = express();

// ------------------- Middleware Setup -------------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // ✅ Allow all origins
  })
);

// ------------------- Health Check -------------------
app.get("/test", (req, res) => res.send("✅ Server running"));

// ------------------- Route Mounting -------------------

// 🧑‍💻 Authentication (Login, Register, Refresh, Logout)
app.use("/api/auth", authRoutes);

// 📘 Public Quiz Info (Instructions, Listing)
app.use("/api/quiz", quizRoutes);

// 🧠 Player Quiz Flow (Start Quiz, Get Questions, Submit Answers)
app.use("/api/quiz", playerQuizRoutes);

// 🛠️ Admin Quiz Management (Create, Add Qs, Publish, Delete)
app.use("/api/admin", adminQuizRoutes);



// ------------------- Export App -------------------
module.exports = app;


