// server/src/routes/quizRoutes.js
const express = require("express");
const router = express.Router();

const {
  getQuizInstructions,
  getPublishedQuizzes,
  getQuizMeta, // ✅ newly added
} = require("../controllers/quizController");

// -----------------------
// 📘 PUBLIC ROUTES
// -----------------------

// ✅ Get published quizzes (for selection)
router.get("/published", getPublishedQuizzes);

// ✅ Get quiz metadata (for instructions page)
router.get("/:quizId/meta", getQuizMeta);

// ✅ Get detailed instructions (if used separately)
router.get("/:quizId/instructions", getQuizInstructions);

module.exports = router;






